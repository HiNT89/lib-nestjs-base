import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //get all users
  @Get()
  getUsers() {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];
  }
  //get user by id
  @Get(':id')
  getUserById(id: string) {
    return `This action returns a #${id} user`;
  }
  // create user
  @Post()
  createUser() {
    return 'This action adds a new user';
  }
  // update user
  @Put(':id')
  updateUser(id: string) {
    return `This action updates a #${id} user`;
  }
  // delete user
  @Delete(':id')
  deleteUser(id: string) {
    return `This action removes a #${id} user`;
  }
}
