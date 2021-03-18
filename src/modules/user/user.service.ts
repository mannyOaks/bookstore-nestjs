import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../shared/entity-status.enum';
import { RoleRepository } from '../role/role.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(userid: number): Promise<ReadUserDto> {
    if (!userid) {
      throw new BadRequestException('userid must be sent');
    }

    const user: User = await this._userRepository.findOne(userid, {
      where: { status: Status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: Status.ACTIVE },
    });

    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const foundUser = await this._userRepository.findOne(userId, {
      where: { status: Status.ACTIVE },
    });

    if (!foundUser) {
      throw new NotFoundException('user does not exist');
    }

    foundUser.username = user.username;
    const updatedUser = this._userRepository.save(foundUser);
    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(userid: number): Promise<void> {
    const userExists = await this._userRepository.findOne(userid, {
      where: { status: Status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException();
    }

    await this._userRepository.update(userid, { status: Status.INACTIVE });
  }

  async setRoleToUser(
    userUserId: number,
    roleUserId: number,
  ): Promise<boolean> {
    const userExists = await this._userRepository.findOne(userUserId, {
      where: { status: Status.ACTIVE },
    });
    if (!userExists) {
      throw new NotFoundException();
    }

    const roleExists = await this._roleRepository.findOne(roleUserId, {
      where: { status: Status.ACTIVE },
    });
    if (!roleExists) {
      throw new NotFoundException();
    }

    userExists.roles.push(roleExists);
    await this._userRepository.save(userExists);

    return true;
  }
}
