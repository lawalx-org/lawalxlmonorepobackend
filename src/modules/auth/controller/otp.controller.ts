// src/otp/otp.controller.ts
import { Controller, Post, Body, Get, Query, Param, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { OtpService } from '../services/otp.services';
import { EmailService } from 'src/modules/utils/services/emailService';
import { otpTemplate } from 'src/modules/utils/template/otptemplate';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { OtpType, PhoneVerifyOtpDto, VerifyOtpDto } from '../dto/otp.dto';


@Controller('otp')
export class OtpController {
  constructor(
    private otpService: OtpService,
    private emailService: EmailService,
     private readonly prisma: PrismaService,
    

  ) {}

@UseGuards(JwtAuthGuard)
@Post('send/:type')
async sendOtp(@Req() req: RequestWithUser, @Param('type') type: OtpType) {
  const id = req.user.userId;
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  switch (type) {
    case 'email':
      const otp = await this.otpService.generate(user.email!);
      await this.emailService.sendMail(
        user.email!,
        'Your OTP Code',
        otpTemplate('User', otp),
      );
      return { message: 'OTP sent successfully to email' };

    case 'phone':
    const result = await this.otpService.sendVerificationCode(user.phoneNumber);
     //todo after completed the woke remove that  result
      return { message: 'OTP sent successfully to phone',result };

    default:
      throw new BadRequestException('Invalid type. Must be "email" or "phone"');
  }
}

  @Post('verify/email')
  async EmailVerifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verify(dto.email, dto.otp);
  }
  
  @Post('verify/phone')
  async PhoneVerifyOtp(@Body() dto:PhoneVerifyOtpDto) {
    return this.otpService.verify(dto.phone, dto.otp);
  }

  
}
