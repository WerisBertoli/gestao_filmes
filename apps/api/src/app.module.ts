import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MoviesModule } from './movies/movies.module';
import { OmdbModule } from './omdb/omdb.module';
import { PrismaModule } from './prisma/prisma.module';
import { WatchedModule } from './watched/watched.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    OmdbModule,
    AuthModule,
    MoviesModule,
    FavoritesModule,
    WatchedModule,
    AdminModule,
  ],
})
export class AppModule {}
