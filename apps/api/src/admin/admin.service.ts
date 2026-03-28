import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserDetail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        favorites: {
          orderBy: { createdAt: 'desc' },
          include: { movie: true },
        },
        watched: {
          orderBy: { createdAt: 'desc' },
          include: { movie: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async rankingFavorites() {
    const grouped = await this.prisma.favorite.groupBy({
      by: ['movieId'],
      _count: true,
      orderBy: { _count: { movieId: 'desc' } },
    });
    const movieIds = grouped.map((g) => g.movieId);
    if (movieIds.length === 0) {
      return [];
    }
    const movies = await this.prisma.movie.findMany({
      where: { id: { in: movieIds } },
    });
    const byId = new Map(movies.map((m) => [m.id, m]));
    return grouped.map((row) => ({
      movie: byId.get(row.movieId),
      count: this.countFromGroup(row._count),
    }));
  }

  async rankingWatched() {
    const grouped = await this.prisma.watched.groupBy({
      by: ['movieId'],
      _count: true,
      orderBy: { _count: { movieId: 'desc' } },
    });
    const movieIds = grouped.map((g) => g.movieId);
    if (movieIds.length === 0) {
      return [];
    }
    const movies = await this.prisma.movie.findMany({
      where: { id: { in: movieIds } },
    });
    const byId = new Map(movies.map((m) => [m.id, m]));
    return grouped.map((row) => ({
      movie: byId.get(row.movieId),
      count: this.countFromGroup(row._count),
    }));
  }

  private countFromGroup(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }
    if (value && typeof value === 'object' && '_all' in value) {
      const n = (value as { _all?: number })._all;
      return typeof n === 'number' ? n : 0;
    }
    return 0;
  }
}
