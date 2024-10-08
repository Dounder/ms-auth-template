import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { isUUID } from 'class-validator';

import { ListResponse, PaginationDto } from 'src/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { CurrentUser, UserResponse, UserSummary } from './interfaces';

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  /**
   * Handles the 'users.health' message pattern to check the health of the users service.
   *
   * @returns {string} A message indicating the users service is up and running.
   */
  @MessagePattern('users.health')
  health(): string {
    return 'users service is up and running!';
  }

  /**
   * Handles the 'users.create' message pattern to create a new user.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing the information to create the user.
   * @returns {Promise<UserResponse>} A promise that resolves to the created user object, excluding sensitive information.
   */
  @MessagePattern('users.create')
  create(@Payload() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Handles the 'users.findAll' message pattern to retrieve a paginated list of users.
   *
   * @param {{ paginationDto: PaginationDto; user: CurrentUser }} payload - An object containing pagination parameters and the requesting user.
   * @returns {Promise<ListResponse<User>>} A promise that resolves to a paginated list of users with metadata.
   */
  @MessagePattern('users.all')
  findAll(@Payload() payload: { paginationDto: PaginationDto; user: CurrentUser }): Promise<ListResponse<User>> {
    const { paginationDto, user } = payload;
    return this.usersService.findAll(paginationDto, user);
  }

  /**
   * Handles the 'users.find.id' message pattern to retrieve a user by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserResponse>} A promise that resolves to the found user object, excluding sensitive information.
   */
  @MessagePattern('users.find.id')
  findOne(@Payload() payload: { id: string; user: CurrentUser }): Promise<UserResponse> {
    const { id, user } = payload;

    if (!isUUID(id)) throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid user ID' });

    return this.usersService.findOne(id, user);
  }

  /**
   * Handles the 'users.find.username' message pattern to retrieve a user by their username.
   *
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<UserResponse>} A promise that resolves to the found user object, excluding sensitive information.
   */
  @MessagePattern('users.find.username')
  findOneByUsername(@Payload() payload: { username: string; user: CurrentUser }): Promise<UserResponse> {
    const { username, user } = payload;

    return this.usersService.findByUsername(username, user);
  }

  /**
   * Handles the 'users.find.summary' message pattern to retrieve a user by their ID with a summary of basic information.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserResponse>} A promise that resolves to the found user object containing only basic information.
   */
  @MessagePattern('users.find.summary')
  findOneWithSummary(@Payload() payload: { id: string; user: CurrentUser }): Promise<UserSummary> {
    const { id, user } = payload;

    if (!isUUID(id)) throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid user ID' });

    return this.usersService.findOneWithSummary(id, user);
  }

  /**
   * Handles the 'users.update' message pattern to update a user.
   *
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the information to update the user.
   * @returns {Promise<UserResponse>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.update')
  update(@Payload() payload: { updateUserDto: UpdateUserDto; user: CurrentUser }): Promise<UserResponse> {
    const { updateUserDto, user } = payload;

    return this.usersService.update(updateUserDto, user);
  }

  /**
   * Handles the 'users.remove' message pattern to soft delete a user.
   *
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<UserResponse>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.remove')
  remove(@Payload() payload: { id: string; user: CurrentUser }): Promise<UserResponse> {
    const { id, user } = payload;

    if (!isUUID(id)) throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid user ID' });

    return this.usersService.remove(id, user);
  }

  /**
   * Handles the 'users.restore' message pattern to restore a previously disabled user.
   *
   * @param {string} id - The ID of the user to restore.
   * @returns {Promise<UserResponse>} A promise that resolves to the updated user object, excluding sensitive information.
   */
  @MessagePattern('users.restore')
  restore(@Payload() payload: { id: string; user: CurrentUser }): Promise<UserResponse> {
    const { id, user } = payload;

    if (!isUUID(id)) throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid user ID' });

    return this.usersService.restore(id, user);
  }
}
