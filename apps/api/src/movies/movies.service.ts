import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { OmdbService } from '../omdb/omdb.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly omdb: OmdbService,
  ) {}

  searchByTitle(title: string) {
    return this.omdb.searchByTitle(title);
  }

  async ensureMovieFromOmdb(imdbId: string): Promise<Movie> {
    const detail = await this.omdb.getByImdbId(imdbId);
    return this.prisma.movie.upsert({
      where: { imdbId: detail.imdbID },
      create: {
        imdbId: detail.imdbID,
        title: detail.Title,
        year: detail.Year ?? null,
        poster: detail.Poster && detail.Poster !== 'N/A' ? detail.Poster : null,
        type: detail.Type ?? null,
      },
      update: {
        title: detail.Title,
        year: detail.Year ?? null,
        poster: detail.Poster && detail.Poster !== 'N/A' ? detail.Poster : null,
        type: detail.Type ?? null,
      },
    });
  }
}
