import { IsEmail, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../../../types';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString()
  @Matches(/^\+2507[8239]\d{7}$/, { message: 'Phone number must be a valid Rwanda number (+250 7...)' })
  phone!: string;

  @IsEnum(['buyer', 'seller', 'admin'], { message: 'Role must be buyer, seller, or admin' })
  role!: UserRole;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long with uppercase, lowercase and numbers' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number' })
  password!: string;

  @IsString()
  captchaToken!: string;
}
