import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Status } from '../../../shared/entity-status.enum';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('bookId must be sent');
    }

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: Status.ACTIVE },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('authorId must be sent');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: Status.ACTIVE, authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];
    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: Status.ACTIVE },
      });

      if (!authorExists) {
        throw new NotFoundException(`Author does not exist: ${authorId}`);
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(`user ${authorId} is not an author`);
      }

      authors.push(authorExists);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async createByAuthor(book: Partial<CreateBookDto>, authorId: number) {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: Status.ACTIVE },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException(`user ${authorId} is not an author`);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async updateBook(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExists: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException('book does not exist');
    }

    const isOwnBook = bookExists.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException("user is not book's author");
    }

    // const updatedBook = await this._bookRepository.update(bookId, book);
    bookExists.name = book.name;
    bookExists.description = book.description;
    await this._bookRepository.save(bookExists);

    return plainToClass(ReadBookDto, bookExists);
  }

  async delete(bookId: number): Promise<void> {
    const bookExists: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException('book does not exist');
    }

    await this._bookRepository.update(bookId, { status: Status.INACTIVE });
  }
}
