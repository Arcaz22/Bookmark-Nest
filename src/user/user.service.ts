import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async editUser(userId: string, editUserDto: EditUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      return null;
    }

    // Update user properties with the values from the editUserDto
    existingUser.name = editUserDto.name;
    existingUser.username = editUserDto.username;
    existingUser.email = editUserDto.email;
    existingUser.phone = editUserDto.phone;

    // Save the updated user to the database
    const updatedUser = await this.userRepository.save(existingUser);

    // Remove sensitive information from the user object
    if ('hash' in updatedUser) {
      delete (updatedUser as { hash: string }).hash;
    }

    return updatedUser;
  }
}
