import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ReadUserDto } from '../../user/dto/read-user.dto';

@Exclude()
export class ReadBookDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @Type(() => ReadUserDto)
  readonly authors: ReadUserDto[];
}
