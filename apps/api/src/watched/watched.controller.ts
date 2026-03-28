import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../auth/types/jwt-payload';
import { ImdbIdBodyDto } from '../movies/dto/movies.dto';
import { WatchedService } from './watched.service';

@Controller('watched')
@UseGuards(AuthGuard('jwt'))
export class WatchedController {
  constructor(private readonly watched: WatchedService) {}

  @Post()
  mark(@CurrentUser() user: JwtPayloadUser, @Body() dto: ImdbIdBodyDto) {
    return this.watched.mark(user.sub, dto.imdbId);
  }

  @Get()
  list(@CurrentUser() user: JwtPayloadUser) {
    return this.watched.listForUser(user.sub);
  }
}
