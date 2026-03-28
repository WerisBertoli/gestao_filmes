import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { MoviesModule } from '../movies/movies.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [MoviesModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, RolesGuard],
})
export class FavoritesModule {}
