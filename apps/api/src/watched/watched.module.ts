import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { MoviesModule } from '../movies/movies.module';
import { WatchedController } from './watched.controller';
import { WatchedService } from './watched.service';

@Module({
  imports: [MoviesModule],
  controllers: [WatchedController],
  providers: [WatchedService, RolesGuard],
})
export class WatchedModule {}
