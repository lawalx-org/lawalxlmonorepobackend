// src/otp/otp.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { addMinutes, isBefore } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { generateOTP } from './utiles.services';
import { JwtService } from '@nestjs/jwt';
import { buildJwtPayload } from '../utils/userbasetoken';

@Injectable()
export class OtpService {
  private client: Twilio.Twilio;
  private verifyServiceSid: string;
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.client = Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
    this.verifyServiceSid = this.configService.get<string>(
      'twilio.verifyServiceSid',
    )!;
  }

  // send Email verification code
  async generate(email: string) {
    const otp = generateOTP();
    const expiresAt = addMinutes(new Date(), 10);

    await this.prisma.otpVerification.upsert({
      where: { email },
      update: {
        verified: false,
        otp,
        expiresAt,
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
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        userStatus: { notIn: ['BANNED', 'DELETED', 'SUSPENDED'] },
      },
    });

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

    const jwtPayload = buildJwtPayload(this.prisma, user);

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('jwt_access_secret'),
      expiresIn: this.configService.get<string>('jwt_access_expires_in'),
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('jwt_refresh_secret'),
      expiresIn: this.configService.get<string>('jwt_refresh_expires_in'),
    });

    return { accessToken, refreshToken };
  }

  //  Send verification code
  async sendVerificationCode(to: string) {
    const data = await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({ to, channel: 'sms' });

    return data;
  }

  //  Check verification code
  async checkVerificationCode(to: string, code: string) {
    try {
      const result = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to, code });

      if (!result) {
        throw new BadRequestException('Verification failed. Please try again.');
      }

      if (result.status !== 'approved') {
        if (result.status === 'pending') {
          throw new BadRequestException(
            'Invalid or incorrect verification code.',
          );
        } else if (result.status === 'expired') {
          throw new BadRequestException(
            'Verification code has expired. Please request a new one.',
          );
        } else {
          throw new BadRequestException(
            'Verification failed. Please try again.',
          );
        }
      }

      const user = await this.prisma.user.findFirst({
        where: {
          phoneNumber: to,
          userStatus: { notIn: ['BANNED', 'DELETED', 'SUSPENDED'] },
        },
      });

      if (!user) {
        throw new NotFoundException(
          'User not found for the provided phone number',
        );
      }

      const expiresAt = addMinutes(new Date(), 10);
      await this.prisma.otpVerification.upsert({
        where: { email: user.email },
        update: { verified: true, otp: code, expiresAt },
        create: { email: user.email, verified: true, otp: code, expiresAt },
      });

      const jwtPayload = buildJwtPayload(this.prisma, user);

      const accessToken = this.jwtService.sign(jwtPayload, {
        secret: this.configService.get<string>('jwt_access_secret'),
        expiresIn: this.configService.get<string>('jwt_access_expires_in'),
      });

      const refreshToken = this.jwtService.sign(jwtPayload, {
        secret: this.configService.get<string>('jwt_refresh_secret'),
        expiresIn: this.configService.get<string>('jwt_refresh_expires_in'),
      });

      return {
        success: true,
        message: 'OTP verified successfully',
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.code === 20404 ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        error.message?.includes('VerificationCheck was not found')
      ) {
        throw new BadRequestException(
          'Verification failed — please check the code and try again',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 60200) {
        throw new BadRequestException('Invalid verification code.');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message || 'Verification failed.');
    }
  }
}
