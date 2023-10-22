import { Bookmark } from 'src/bookmark/entity/bookmark.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum';

@Entity()
export class User {
  @ApiProperty({
    description: 'uuid user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'name User',
    example: 'Jhon Doe',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Username User',
    example: 'Jhon Doe',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'Email User',
    example: 'jhondoe@gmail.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Password User',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Phone User',
    example: '085111112344',
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: 'Role User',
    example: 'user',
  })
  @Column({ default: 'user' })
  role: Role;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];
}
