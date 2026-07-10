import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { UserId } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/auth.decorators';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@UserId() userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@UserId() userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Public()
  @Get(':username')
  @ApiOperation({ summary: 'Get public profile by username' })
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get user followers' })
  getFollowers(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.getFollowers(userId, page, limit);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get user following' })
  getFollowing(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.getFollowing(userId, page, limit);
  }

  @Post(':userId/follow')
  @ApiOperation({ summary: 'Follow a user' })
  follow(@UserId() followerId: string, @Param('userId') followingId: string) {
    return this.usersService.follow(followerId, followingId);
  }

  @Delete(':userId/follow')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@UserId() followerId: string, @Param('userId') followingId: string) {
    return this.usersService.unfollow(followerId, followingId);
  }
}
