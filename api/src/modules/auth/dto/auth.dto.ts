import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: 'cooluser' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @ApiProperty({ example: 'Cool User' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiPropertyOptional({ enum: ['ios', 'android', 'web'] })
  @IsOptional()
  @IsString()
  platform?: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class PhoneOtpDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;
}

export class PhoneVerifyDto extends PhoneOtpDto {
  @ApiProperty()
  @IsString()
  otp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  platform?: string;
}

export class GuestLoginDto {
  @ApiProperty()
  @IsString()
  deviceFingerprint: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiProperty({ enum: ['ios', 'android', 'web'] })
  @IsString()
  platform: string;
}
