import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { OmdbModule } from '../omdb/omdb.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [OmdbModule],
  controllers: [MoviesController],
  providers: [MoviesService, RolesGuard],
  exports: [MoviesService],
})
export class MoviesModule {}
