import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, FilterBookmark, UpdateBookmark } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { Bookmark } from './entity/bookmark.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('user')
  @Post('create')
  createBookmark(
    @GetUser('id') userId: string,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    return this.bookmarkService.createBookmark(userId, createBookmarkDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('user')
  @Get()
  getBookmark(@Query() filterBookmark: FilterBookmark): Promise<Bookmark[]> {
    return this.bookmarkService.getBookmark(filterBookmark);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('user')
  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Bookmark> {
    return this.bookmarkService.getBookmarkById(id);
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  updateBookmark(
    @Param('id') id: string,
    @Body() updateBookmark: UpdateBookmark,
  ): Promise<Bookmark> {
    return this.bookmarkService.updateBookmark(id, updateBookmark);
  }

  @Delete('/:id')
  deleteBookmark(@Param('id') id: string): Promise<void> {
    return this.bookmarkService.deleteBookmark(id);
  }
}
