import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3, { message: 'Email or phone identifier required' })
  identifier!: string;

  @IsString()
  @MinLength(6, { message: 'Password is required' })
  password!: string;

  @IsString()
  captchaToken!: string;
}
