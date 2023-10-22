import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entity/bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookmarkDto, FilterBookmark, UpdateBookmark } from './dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async createBookmark(
    userId: string,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const { title, description, link } = createBookmarkDto;

    const bookmark = this.bookmarkRepository.create({
      user: { id: userId },
      title,
      description,
      link,
    });
    await this.bookmarkRepository.save(bookmark);
    return bookmark;
  }

  async getBookmark(filterBookmark: FilterBookmark): Promise<Bookmark[]> {
    const { search } = filterBookmark;

    const query = this.bookmarkRepository.createQueryBuilder('bookmark');

    if (search) {
      query.andWhere(
        'LOWER(bookmark.title) LIKE LOWER(:search) OR LOWER(bookmark.description) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const bookmarks = await query.getMany();
    return bookmarks;
  }

  async getBookmarkById(id: string): Promise<Bookmark> {
    const found = await this.bookmarkRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }

    return found;
  }

  async updateBookmark(
    id: string,
    updateBookmark: UpdateBookmark,
  ): Promise<Bookmark> {
    const bookmark = await this.getBookmarkById(id);

    if (updateBookmark.title) {
      bookmark.title = updateBookmark.title;
    }

    if (updateBookmark.description) {
      bookmark.description = updateBookmark.description;
    }

    const updatedBookmark = await this.bookmarkRepository.save(bookmark);

    return updatedBookmark;
  }

  async deleteBookmark(id: string): Promise<void> {
    const result = await this.bookmarkRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Bookmark with Id "${id}" not found`);
    }
  }
}
