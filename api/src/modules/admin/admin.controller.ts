import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/auth.decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole, UserStatus } from '../users/enums/user-role.enum';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OWNER)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  searchUsers(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: UserStatus,
  ) {
    return this.adminService.searchUsers(query ?? '', page, limit, status);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user details' })
  getUser(@Param('userId') userId: string) {
    return this.adminService.getUser(userId);
  }

  @Patch('users/:userId/status')
  @ApiOperation({ summary: 'Update user status' })
  updateStatus(
    @Param('userId') userId: string,
    @Body() body: { status: UserStatus },
  ) {
    return this.adminService.updateUserStatus(userId, body.status);
  }

  @Get('withdrawals/pending')
  @ApiOperation({ summary: 'Pending withdrawals' })
  pendingWithdrawals() {
    return this.adminService.getPendingWithdrawals();
  }

  @Post('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal' })
  approve(@Param('id') id: string) {
    return this.adminService.approveWithdrawal(id);
  }

  @Post('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal' })
  reject(@Param('id') id: string) {
    return this.adminService.rejectWithdrawal(id);
  }

  @Get('dashboard/revenue')
  @ApiOperation({ summary: 'Revenue dashboard' })
  dashboard() {
    return this.adminService.getDashboardStats();
  }
}
