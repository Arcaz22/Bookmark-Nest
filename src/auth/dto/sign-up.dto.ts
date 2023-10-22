import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class signUpDto {
  @ApiProperty({
    description: 'Username User',
    example: 'Jhon Doe',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'Password User',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @ApiProperty({
    description: 'Name User',
    example: 'Jhon Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email User',
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'phone User',
    example: '081256674211',
  })
  @IsString()
  phone: string;
}
