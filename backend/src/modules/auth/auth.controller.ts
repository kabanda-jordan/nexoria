import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set secure HttpOnly, SameSite=Strict cookie for Refresh Token
    response.cookie('nexora_refresh_token', result.tokens.refreshToken, {
      httpOnly: true, // Prevents XSS script theft
      secure: true,   // Requires HTTPS
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh-token',
    });

    return {
      status: result.status,
      message: result.message,
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('nexora_refresh_token', {
      path: '/api/v1/auth/refresh-token',
    });
    return { message: 'Logged out successfully' };
  }
}
