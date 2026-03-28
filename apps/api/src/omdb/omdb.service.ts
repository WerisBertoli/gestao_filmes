import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

export type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type OmdbMovieDetail = {
  imdbID: string;
  Title: string;
  Year?: string;
  Type?: string;
  Poster?: string;
  Response: string;
  Error?: string;
};

@Injectable()
export class OmdbService {
  private readonly baseUrl = 'https://www.omdbapi.com/';
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    this.apiKey = config.getOrThrow<string>('OMDB_API_KEY');
  }

  async searchByTitle(title: string): Promise<{
    results: OmdbSearchItem[];
    total: number;
  }> {
    const trimmed = title?.trim();
    if (!trimmed) {
      return { results: [], total: 0 };
    }
    try {
      const { data } = await axios.get<{
        Search?: OmdbSearchItem[];
        totalResults?: string;
        Response: string;
        Error?: string;
      }>(this.baseUrl, {
        params: { s: trimmed, apikey: this.apiKey },
        timeout: 12_000,
        validateStatus: (s) => s < 500,
      });
      if (data.Response === 'False') {
        return { results: [], total: 0 };
      }
      const results = data.Search ?? [];
      const total = Number.parseInt(data.totalResults ?? '0', 10) || 0;
      return { results, total };
    } catch (e) {
      this.handleAxiosError(e);
    }
  }

  async getByImdbId(imdbId: string): Promise<OmdbMovieDetail> {
    const id = imdbId?.trim();
    if (!id) {
      throw new BadRequestException('imdbId inválido');
    }
    try {
      const { data } = await axios.get<OmdbMovieDetail>(this.baseUrl, {
        params: { i: id, plot: 'short', apikey: this.apiKey },
        timeout: 12_000,
        validateStatus: (s) => s < 500,
      });
      if (data.Response === 'False') {
        throw new BadRequestException(
          data.Error ?? 'Filme não encontrado na OMDb',
        );
      }
      return data;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      this.handleAxiosError(e);
    }
  }

  private handleAxiosError(e: unknown): never {
    if (axios.isAxiosError(e)) {
      const err = e as AxiosError;
      if (err.code === 'ECONNABORTED') {
        throw new ServiceUnavailableException('OMDb demorou demais para responder');
      }
      if (!err.response) {
        throw new ServiceUnavailableException('Não foi possível contatar a OMDb');
      }
    }
    throw new ServiceUnavailableException('Falha ao consultar a OMDb');
  }
}
