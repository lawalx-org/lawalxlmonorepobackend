// src/otp/otp.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { addMinutes, isBefore } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { generateOTP } from './utiles.services';

@Injectable()
export class OtpService {
  private client: Twilio.Twilio;
  private verifyServiceSid: string;
  constructor(private prisma: PrismaService, private configService: ConfigService) {
     this.client = Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
    this.verifyServiceSid = this.configService.get<string>('twilio.verifyServiceSid')!;
  }
  
   // send Email verification code
  async generate(email: string) {
    const otp = generateOTP();
    const expiresAt = addMinutes(new Date(), 10);

    await this.prisma.otpVerification.upsert({
      where:{email},
      update:{
        verified: false ,
        otp,
        expiresAt
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });

    return otp;
  }
  
  // Check Email verification code
  async verify(email: string, submittedOtp: string) {
    const user = await this.prisma.user.findFirst({where:{email,userStatus:{notIn:['BANNED','DELETED','SUSPENDED']}}})

    if (!user) {
      throw new NotFoundException('User not found for the provided email');
    }
    const record = await this.prisma.otpVerification.findFirst({
      where: { email, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('OTP not found');

    if (record.otp !== submittedOtp)
      throw new BadRequestException('Invalid OTP');

    if (isBefore(record.expiresAt, new Date()))
      throw new BadRequestException('OTP expired');

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return { message: 'OTP verified successfully' };
  }


  //  Send verification code
  async sendVerificationCode(to: string) {
    console.log(this.client,this.verifyServiceSid)
    const data = await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({ to, channel: 'sms' });
      
    return data
  }

  //  Check verification code
 async checkVerificationCode(to: string, code: string) {
  const result = await this.client.verify.v2
    .services(this.verifyServiceSid)
    .verificationChecks.create({ to, code });
     const expiresAt = addMinutes(new Date(), 10);

  if (result.status === 'approved') {
    const user = await this.prisma.user.findFirst({where:{phoneNumber:to,userStatus:{notIn:['BANNED','DELETED','SUSPENDED']}}})

    if (!user) {
      throw new NotFoundException('User not found for the provided phone number');
    }

  
    await this.prisma.otpVerification.upsert({
      where: { email: user?.email }, 
      update: {
        verified: true,
        otp: code, 
        expiresAt: expiresAt , 
      },
      create: {
        email: user?.email!,  
        verified: true,
        otp: code,
        expiresAt: expiresAt,
      },
    });

    return { verified: true, message: 'OTP verified successfully' };
  } else {
    
    throw new BadRequestException('Invalid or expired OTP code');
  }
}

  
  
}


