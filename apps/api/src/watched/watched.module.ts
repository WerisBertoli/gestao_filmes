import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { WatchedController } from './watched.controller';
import { WatchedService } from './watched.service';

@Module({
  imports: [MoviesModule],
  controllers: [WatchedController],
  providers: [WatchedService],
})
export class WatchedModule {}
