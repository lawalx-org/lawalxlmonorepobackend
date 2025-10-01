// src/otp/otp.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';

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

    await this.prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    return otp;
  }
  
  // Check Email verification code
  async verify(email: string, submittedOtp: string) {
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
    return this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({ to, channel: 'sms' });
  }

  //  Check verification code
  async checkVerificationCode(to: string, code: string) {
    return this.client.verify.v2
      .services(this.verifyServiceSid)
      .verificationChecks.create({ to, code });
  }

   async getChooseOptions(username: string) {
   
    // return {
    //   email: maskEmail(user.email),
    //   phone: maskPhone(user.phone),
    // };
  }
  
}


