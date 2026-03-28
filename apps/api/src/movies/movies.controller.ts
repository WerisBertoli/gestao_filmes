import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { MoviesService } from './movies.service';

@Controller('movies')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.COMUM)
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}

  @Get('search')
  search(@Query('title') title: string) {
    return this.movies.searchByTitle(title ?? '');
  }
}
