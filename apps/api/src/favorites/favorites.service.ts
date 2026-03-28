import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MoviesService } from '../movies/movies.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movies: MoviesService,
  ) {}

  async add(userId: string, imdbId: string) {
    const movie = await this.movies.ensureMovieFromOmdb(imdbId);
    try {
      await this.prisma.favorite.create({
        data: { userId, movieId: movie.id },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Este filme já está nos seus favoritos');
      }
      throw e;
    }
    return { ok: true, movieId: movie.id };
  }

  listForUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { movie: true },
    });
  }
}
