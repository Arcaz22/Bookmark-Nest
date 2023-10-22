import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class signInDto {
  @ApiProperty({
    description: 'Email User',
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password User',
  })
  @IsString()
  password: string;
}
