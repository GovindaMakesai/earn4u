import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/auth.decorators';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  PhoneOtpDto,
  GuestLoginDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto, @Req() req: { ip?: string }) {
    return this.authService.login(dto, req.ip);
  }

  @Public()
  @Post('login/guest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Guest login' })
  guestLogin(@Body() dto: GuestLoginDto, @Req() req: { ip?: string }) {
    return this.authService.guestLogin(dto, req.ip);
  }

  @Public()
  @Post('login/phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request phone OTP' })
  requestPhoneOtp(@Body() _dto: PhoneOtpDto) {
    return { otpSent: true, expiresIn: 300 };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  logout(@Req() req: { user?: { sub: string } }) {
    const user = req.user as { sub: string };
    return this.authService.logout(user.sub);
  }
}
