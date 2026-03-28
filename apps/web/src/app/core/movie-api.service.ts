import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type MovieRow = {
  id: string;
  imdbId: string;
  title: string;
  year: string | null;
  poster: string | null;
  type: string | null;
};

export type FavoriteRow = {
  id: string;
  createdAt: string;
  movie: MovieRow;
};

export type WatchedRow = {
  id: string;
  createdAt: string;
  movie: MovieRow;
};

export type UserListItem = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export type UserDetail = UserListItem & {
  favorites: FavoriteRow[];
  watched: WatchedRow[];
};

export type RankingRow = {
  movie: MovieRow | undefined;
  count: number;
};

@Injectable({ providedIn: 'root' })
export class MovieApiService {
  private readonly http = inject(HttpClient);

  searchMovies(title: string): Observable<{
    results: OmdbSearchItem[];
    total: number;
  }> {
    return this.http.get<{ results: OmdbSearchItem[]; total: number }>(
      `${environment.apiUrl}/movies/search`,
      { params: { title } },
    );
  }

  addFavorite(imdbId: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${environment.apiUrl}/favorites`, {
      imdbId,
    });
  }

  markWatched(imdbId: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${environment.apiUrl}/watched`, {
      imdbId,
    });
  }

  listFavorites(): Observable<FavoriteRow[]> {
    return this.http.get<FavoriteRow[]>(`${environment.apiUrl}/favorites`);
  }

  listWatched(): Observable<WatchedRow[]> {
    return this.http.get<WatchedRow[]>(`${environment.apiUrl}/watched`);
  }

  listUsers(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${environment.apiUrl}/admin/users`);
  }

  getUserDetail(id: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(
      `${environment.apiUrl}/admin/users/${id}`,
    );
  }

  rankingFavorites(): Observable<RankingRow[]> {
    return this.http.get<RankingRow[]>(
      `${environment.apiUrl}/admin/rankings/favorites`,
    );
  }

  rankingWatched(): Observable<RankingRow[]> {
    return this.http.get<RankingRow[]>(
      `${environment.apiUrl}/admin/rankings/watched`,
    );
  }
}
