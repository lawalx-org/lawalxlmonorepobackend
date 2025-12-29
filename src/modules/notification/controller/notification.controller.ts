import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { NotificationService } from '../service/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { JwtAuthGuard } from '../../../common/jwt/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../../../types/RequestWithUser';
import { Roles } from 'src/common/jwt/roles.decorator';
import { UpdateEmployeeNotificationDto } from '../dto/update-employee-notification.dto';
import { UpdateManagerNotificationDto } from '../dto/update-manager-notification.dto';
import { UpdateClientNotificationDto } from '../dto/update-client-notification.dto';
import { Role } from 'generated/prisma';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.notificationService.create(
      createNotificationDto,
      req.user.userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('received')
  findAll(@Req() req: RequestWithUser) {
    return this.notificationService.findAll(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('sent')
  findSentNotifications(@Req() req: RequestWithUser) {
    console.log('request user', req.user);
    return this.notificationService.findSentNotifications(req.user.userId);
  }
  // ================= EMPLOYEE =================
  @Patch('employee')
  @Roles('EMPLOYEE')
  updateEmployee(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateEmployeeNotificationDto,
  ) {
    return this.notificationService.updateEmployeePermission(
      req.user.userId,
      dto,
    );
  }

  // ================= MANAGER =================
  @Patch('manager')
  @Roles('MANAGER')
  updateManager(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateManagerNotificationDto,
  ) {
    return this.notificationService.updateManagerPermission(
      req.user.userId,
      dto,
    );
  }

  // ================= CLIENT =================
  @UseGuards(JwtAuthGuard)
  @Patch('client')
  @Roles('CLIENT')
  updateClient(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateClientNotificationDto,
  ) {
    return this.notificationService.updateClientPermission(
      req.user.userId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('permissions')
  getMyPermissions(@Req() req: RequestWithUser) { 
    const role = req.user.role as Role;
    return this.notificationService.getMyNotificationPermissions(
      req.user.userId,
      role,
    );
  }
}
