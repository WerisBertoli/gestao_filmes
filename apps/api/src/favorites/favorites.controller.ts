import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../auth/types/jwt-payload';
import { ImdbIdBodyDto } from '../movies/dto/movies.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Post()
  add(@CurrentUser() user: JwtPayloadUser, @Body() dto: ImdbIdBodyDto) {
    return this.favorites.add(user.sub, dto.imdbId);
  }

  @Get()
  list(@CurrentUser() user: JwtPayloadUser) {
    return this.favorites.listForUser(user.sub);
  }
}
