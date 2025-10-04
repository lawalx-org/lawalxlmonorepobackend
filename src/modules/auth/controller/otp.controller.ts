// src/otp/otp.controller.ts
import { Controller, Post, Body, Get, Query, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { OtpService } from '../services/otp.services';
import { EmailService } from 'src/modules/utils/services/emailService';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { otpTemplate } from 'src/modules/utils/template/otptemplate';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';


@Controller('otp')
export class OtpController {
  constructor(
    private otpService: OtpService,
    private emailService: EmailService,
     private readonly prisma: PrismaService,
    

  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('send/:type')
  async sendOtp( @Param('type') type: string,) {


    const user = await this.prisma.user.findUnique({
      where: {email:}
    })
     
    switch(type) {
        case 'email':
          const otp = await this.otpService.generate(dto.email!);
          await this.emailService.sendMail(
            dto.email!,
            'Your OTP Code',
            otpTemplate('User', otp),
          );


        case 'phone':
          await this.otpService.sendVerificationCode(dto.phone!)

        default:
            throw new BadRequestException('Invalid type. Must be "email" or "phone"');

    }



    
    
    

    

    return { message: 'OTP sent successfully' };
  }

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verify(dto.email, dto.otp);
  }

  
}
