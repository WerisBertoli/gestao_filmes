import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import type { JwtPayloadUser } from '../auth/types/jwt-payload';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ImdbIdBodyDto } from '../movies/dto/movies.dto';
import { WatchedService } from './watched.service';

@Controller('watched')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.COMUM)
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
