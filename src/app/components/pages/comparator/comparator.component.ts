import { Component, OnInit } from '@angular/core';
import { LegendsService } from '../../../services/legends.service';
import { Champion, ChampionDetail } from '../../../models/champion.model';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss']
})
export class ComparatorComponent implements OnInit {

  allChampions: Champion[] = [];
  selectedChampion1: ChampionDetail | null = null;
  selectedChampion2: ChampionDetail | null = null;

  search1: string = '';
  search2: string = '';

  filtered1: Champion[] = [];
  filtered2: Champion[] = [];

  loading = true;
  loadingDetail1 = false;
  loadingDetail2 = false;

  constructor(private legendsService: LegendsService) {}

  ngOnInit(): void {
    this.loadChampions();
  }

  loadChampions(): void {
    this.loading = true;
    this.legendsService.getAllChampions().subscribe({
      next: (data) => {
        this.allChampions = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filtered1 = [...this.allChampions];
        this.filtered2 = [...this.allChampions];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterChampions(side: 1 | 2): void {
    const term = side === 1 ? this.search1.toLowerCase() : this.search2.toLowerCase();
    const filtered = this.allChampions.filter(c =>
      c.name.toLowerCase().includes(term) || c.title.toLowerCase().includes(term)
    );

    if (side === 1) this.filtered1 = filtered;
    else this.filtered2 = filtered;
  }

  selectChampion(side: 1 | 2, champion: Champion): void {
    const loader = side === 1 ? 'loadingDetail1' : 'loadingDetail2';

    this[loader] = true;

    this.legendsService.getChampionDetail(champion.id).subscribe({
      next: (detail) => {
        if (side === 1) {
          this.selectedChampion1 = detail;
          this.search1 = '';
        } else {
          this.selectedChampion2 = detail;
          this.search2 = '';
        }
        this[loader] = false;
      },
      error: () => {
        this[loader] = false;
        alert('Error al cargar el campeón');
      }
    });
  }

  clearSelection(side: 1 | 2): void {
    if (side === 1) {
      this.selectedChampion1 = null;
      this.search1 = '';
      this.filtered1 = [...this.allChampions];
    } else {
      this.selectedChampion2 = null;
      this.search2 = '';
      this.filtered2 = [...this.allChampions];
    }
  }

  getStatComparison(statKey: string): { 
    value1: number; 
    value2: number; 
    winner: 1 | 2 | 0 
  } {
    const stat = statKey as 'attack' | 'defense' | 'magic' | 'difficulty';
    const v1 = this.selectedChampion1?.info[stat] || 0;
    const v2 = this.selectedChampion2?.info[stat] || 0;
    const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;
    return { value1: v1, value2: v2, winner };
  }

  getOverallScore(champ: ChampionDetail | null): number {
    if (!champ) return 0;
    const { attack, defense, magic, difficulty } = champ.info;
    return Math.round((attack + defense + magic) / 3 * 10) / 10;
  }

  getWinner(): string {
    if (!this.selectedChampion1 || !this.selectedChampion2) return '';

    const score1 = this.getOverallScore(this.selectedChampion1);
    const score2 = this.getOverallScore(this.selectedChampion2);

    if (score1 > score2) return this.selectedChampion1.name;
    if (score2 > score1) return this.selectedChampion2.name;
    return 'Empate';
  }

  getIconUrl(id: string): string {
    return this.legendsService.getChampionIconUrl(id);
  }
}
