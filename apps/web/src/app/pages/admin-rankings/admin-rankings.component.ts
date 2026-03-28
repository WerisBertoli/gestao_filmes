import { Component, OnInit, inject } from '@angular/core';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, RankingRow } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-rankings',
  standalone: true,
  imports: [DxLoadIndicatorModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Rankings</h2>
          <p class="subtitle">Filmes mais populares entre os usuários</p>
        </div>
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando rankings...</span></div>
      } @else {
        <div class="grid-2">
          <div class="rank-card card">
            <div class="rank-head fav-head">
              <span class="rank-icon">&#9825;</span>
              <div>
                <p class="rank-label">Mais Favoritados</p>
                <p class="rank-count">{{ favoritesRank.length }} filme(s)</p>
              </div>
            </div>
            <div class="rank-list">
              @for (r of favoritesRank; track r.movie?.imdbId; let i = $index) {
                <div class="rank-row" [class.top3]="i < 3">
                  <div class="rank-pos" [class.gold]="i===0" [class.silver]="i===1" [class.bronze]="i===2">
                    {{ i < 3 ? medals[i] : i + 1 }}
                  </div>
                  @if (r.movie?.poster && r.movie?.poster !== 'N/A') {
                    <img class="rank-poster" [src]="r.movie!.poster!" [alt]="r.movie!.title" />
                  } @else {
                    <div class="rank-poster-ph">&#127909;</div>
                  }
                  <span class="rank-title">{{ r.movie?.title }}</span>
                  <span class="rank-badge">{{ r.count }}</span>
                </div>
              }
            </div>
          </div>
          <div class="rank-card card">
            <div class="rank-head watch-head">
              <span class="rank-icon">&#127909;</span>
              <div>
                <p class="rank-label">Mais Assistidos</p>
                <p class="rank-count">{{ watchedRank.length }} filme(s)</p>
              </div>
            </div>
            <div class="rank-list">
              @for (r of watchedRank; track r.movie?.imdbId; let i = $index) {
                <div class="rank-row" [class.top3]="i < 3">
                  <div class="rank-pos" [class.gold]="i===0" [class.silver]="i===1" [class.bronze]="i===2">
                    {{ i < 3 ? medals[i] : i + 1 }}
                  </div>
                  @if (r.movie?.poster && r.movie?.poster !== 'N/A') {
                    <img class="rank-poster" [src]="r.movie!.poster!" [alt]="r.movie!.title" />
                  } @else {
                    <div class="rank-poster-ph">&#127909;</div>
                  }
                  <span class="rank-title">{{ r.movie?.title }}</span>
                  <span class="rank-badge lime">{{ r.count }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 1.75rem; }
    h2 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.2rem; color: #0F1A35; letter-spacing: -0.025em; }
    .subtitle { font-size: 0.875rem; color: #6B7A99; margin: 0; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #6B7A99; font-size: 0.875rem; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 680px) { .grid-2 { grid-template-columns: 1fr; } }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(29,57,140,0.08); border: 1px solid #EEF2FF; display: flex; flex-direction: column; }
    .rank-head { display: flex; align-items: center; gap: 0.9rem; padding: 1.1rem 1.25rem; border-bottom: 1px solid #EEF2FF; flex-shrink: 0; }
    .fav-head { background: linear-gradient(90deg, #EAEFFF, #F5F7FF); }
    .watch-head { background: linear-gradient(90deg, rgba(210,224,3,0.1), rgba(210,224,3,0.02)); }
    .rank-icon { font-size: 1.5rem; line-height: 1; }
    .rank-label { font-weight: 700; font-size: 0.9rem; color: #0F1A35; margin: 0; }
    .rank-count { font-size: 0.72rem; color: #6B7A99; margin: 0.1rem 0 0; }
    .rank-list { overflow-y: auto; max-height: 480px; }
    .rank-list::-webkit-scrollbar { width: 4px; }
    .rank-list::-webkit-scrollbar-track { background: transparent; }
    .rank-list::-webkit-scrollbar-thumb { background: #DDE3F0; border-radius: 4px; }
    .rank-row { display: flex; align-items: center; gap: 0.85rem; padding: 0.65rem 1.1rem; border-bottom: 1px solid #F3F5FC; transition: background 0.15s; }
    .rank-row:last-child { border-bottom: none; }
    .rank-row:hover { background: #F7F9FF; }
    .rank-row.top3 { background: linear-gradient(90deg, rgba(29,57,140,0.03), transparent); }
    .rank-row.top3:hover { background: linear-gradient(90deg, rgba(29,57,140,0.07), #F7F9FF); }
    .rank-pos { width: 28px; text-align: center; font-weight: 800; font-size: 0.78rem; color: #98A2BE; flex-shrink: 0; }
    .rank-pos.gold   { font-size: 1.1rem; color: #F59E0B; }
    .rank-pos.silver { font-size: 1.1rem; color: #94A3B8; }
    .rank-pos.bronze { font-size: 1.1rem; color: #C07840; }
    .rank-poster { width: 34px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .rank-poster-ph { width: 34px; height: 48px; border-radius: 6px; background: linear-gradient(135deg, #EAEFFF, #DDE6FF); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .rank-title { flex: 1; font-size: 0.85rem; font-weight: 600; color: #0F1A35; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .rank-badge { flex-shrink: 0; background: #EAEFFF; color: #1D398C; font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 20px; min-width: 32px; text-align: center; }
    .rank-badge.lime { background: rgba(210,224,3,0.18); color: #5A6B00; }
    .msg-error { color: #D63939; font-size: 0.875rem; margin-top: 0.5rem; }
  `],
})
export class AdminRankingsComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  readonly medals = ['🥇', '🥈', '🥉'];
  favoritesRank: RankingRow[] = []; watchedRank: RankingRow[] = []; loading = true; error = '';
  ngOnInit(): void {
    let p = 2;
    const done = (): void => { p -= 1; if (p === 0) this.loading = false; };
    this.api.rankingFavorites().subscribe({ next: (r) => { this.favoritesRank = r.filter(x => x.movie); done(); }, error: () => { this.error = 'Erro ao carregar rankings.'; done(); } });
    this.api.rankingWatched().subscribe({ next: (r) => { this.watchedRank = r.filter(x => x.movie); done(); }, error: () => { this.error = 'Erro ao carregar rankings.'; done(); } });
  }
}
