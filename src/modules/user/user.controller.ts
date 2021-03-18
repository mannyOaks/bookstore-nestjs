import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':userid')
  // @Roles(RoleType.ADMIN)
  // @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('userid', ParseIntPipe) userid: number): Promise<ReadUserDto> {
    return this._userService.get(userid);
  }

  @UseGuards(AuthGuard())
  @Get()
  getUsers(): Promise<ReadUserDto[]> {
    return this._userService.getAll();
  }

  @Patch(':userid')
  updateUser(
    @Param('userid', ParseIntPipe) userid: number,
    @Body() user: UpdateUserDto,
  ) {
    return this._userService.update(userid, user);
  }

  @Delete(':userid')
  deleteUser(@Param('userid', ParseIntPipe) userid: number): Promise<void> {
    return this._userService.delete(userid);
  }

  @Post('setRole/:userUserId/:roleUserId')
  setRoleToUser(
    @Param('userUserId', ParseIntPipe) userUserId: number,
    @Param('roleUserId', ParseIntPipe) roleUserId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userUserId, roleUserId);
  }
}
