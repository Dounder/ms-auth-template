import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { ListResponse, PaginationDto } from 'src/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserModel } from './interfaces';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles the 'users.health' message pattern to check the health of the users service.
   *
   * @returns {string} A message indicating the users service is up and running.
   */
  @MessagePattern('users.health')
  health() {
    return 'users service is up and running!';
  }

  /**
   * Handles the 'users.create' message pattern to create a new user.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing the information to create the user.
   * @returns {Promise<Partial<User>>} A promise that resolves to the created user object, excluding sensitive information.
   */
  @MessagePattern('users.create')
  create(@Payload() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Handles the 'users.findAll' message pattern to retrieve a paginated list of users.
   *
   * @param {{ paginationDto: PaginationDto; user: UserModel }} payload - An object containing pagination parameters and the requesting user.
   * @returns {Promise<ListResponse<User>>} A promise that resolves to a paginated list of users with metadata.
   */
  @MessagePattern('users.findAll')
  findAll(@Payload() payload: { paginationDto: PaginationDto; user: UserModel }): Promise<ListResponse<User>> {
    const { paginationDto, user } = payload;
    return this.usersService.findAll(paginationDto, user);
  }

  /**
   * Handles the 'users.find.id' message pattern to retrieve a user by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Partial<User>>} A promise that resolves to the found user object, excluding sensitive information.
   */
  @MessagePattern('users.find.id')
  findOne(@Payload('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.findOne(id);
  }

  /**
   * Handles the 'users.find.username' message pattern to retrieve a user by their username.
   *
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<Partial<User>>} A promise that resolves to the found user object, excluding sensitive information.
   */
  @MessagePattern('users.find.username')
  findOneByUsername(@Payload('username') username: string): Promise<Partial<User>> {
    return this.usersService.findByEmailOrUsername({ username });
  }

  /**
   * Handles the 'users.find.email' message pattern to retrieve a user by their email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<Partial<User>>} A promise that resolves to the found user object, excluding sensitive information.
   */
  @MessagePattern('users.find.email')
  findOneByEmail(@Payload('email') email: string): Promise<Partial<User>> {
    return this.usersService.findByEmailOrUsername({ email });
  }

  /**
   * Handles the 'users.find.meta' message pattern to retrieve a user by their ID, including additional metadata.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Partial<User>>} A promise that resolves to the found user object with metadata, excluding sensitive information.
   */
  @MessagePattern('users.find.meta')
  findMeta(@Payload('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.findOneWithMeta(id);
  }

  /**
   * Handles the 'users.find.summary' message pattern to retrieve a user by their ID with a summary of basic information.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Partial<User>>} A promise that resolves to the found user object containing only basic information.
   */
  @MessagePattern('users.find.summary')
  findOneWithSummary(@Payload('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.findOneWithSummary(id);
  }

  /**
   * Handles the 'users.update' message pattern to update a user.
   *
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the information to update the user.
   * @returns {Promise<Partial<User>>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.update')
  update(@Payload() updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    return this.usersService.update(updateUserDto);
  }

  /**
   * Handles the 'users.remove' message pattern to soft delete a user.
   *
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<Partial<User>>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.remove')
  remove(@Payload('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.remove(id);
  }

  /**
   * Handles the 'users.restore' message pattern to restore a previously disabled user.
   *
   * @param {string} id - The ID of the user to restore.
   * @returns {Promise<Partial<User>>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.restore')
  restore(@Payload('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.restore(id);
  }
}
