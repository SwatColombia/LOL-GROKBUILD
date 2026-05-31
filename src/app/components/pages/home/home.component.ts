import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { LegendsService } from '../../../services/legends.service';
import { Champion, ChampionDetail } from '../../../models/champion.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  champions: Champion[] = [];
  filteredChampions: Champion[] = [];
  selectedChampion: ChampionDetail | null = null;

  searchTerm: string = '';
  selectedRoles: string[] = [];

  availableRoles: string[] = ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'];

  loading = true;
  error: string | null = null;
  loadingDetail = false;

  constructor(public legendsService: LegendsService) {}

  ngOnInit(): void {
    this.loadChampions();
  }

  loadChampions(): void {
    this.loading = true;
    this.error = null;

    this.legendsService.getAllChampions().subscribe({
      next: (data) => {
        this.champions = data.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredChampions = [...this.champions];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando campeones:', err);
        this.error = 'No se pudieron cargar los campeones. Intenta recargar la página.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleRole(role: string): void {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    } else {
      this.selectedRoles = [...this.selectedRoles, role];
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRoles = [];
    this.filteredChampions = [...this.champions];
  }

  private applyFilters(): void {
    let result = [...this.champions];

    // Filtro por texto
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(champ =>
        champ.name.toLowerCase().includes(term) ||
        champ.title.toLowerCase().includes(term)
      );
    }

    // Filtro por roles
    if (this.selectedRoles.length > 0) {
      result = result.filter(champ =>
        this.selectedRoles.every(role => champ.tags.includes(role))
      );
    }

    this.filteredChampions = result;
  }

  openChampionDetail(champion: Champion): void {
    this.loadingDetail = true;
    this.selectedChampion = null;

    this.legendsService.getChampionDetail(champion.id).subscribe({
      next: (detail) => {
        this.selectedChampion = detail;
        this.loadingDetail = false;
        document.body.style.overflow = 'hidden'; // bloquear scroll
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.loadingDetail = false;
        alert('No se pudo cargar el detalle del campeón.');
      }
    });
  }

  closeModal(): void {
    this.selectedChampion = null;
    document.body.style.overflow = 'auto';
  }

  scrollToChampions(): void {
    const filters = document.querySelector('.filters-section');
    if (filters) {
      filters.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Helpers para el template
  getChampionIcon(champion: Champion): string {
    return this.legendsService.getChampionIconUrl(champion.id);
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      Assassin: '🗡️',
      Fighter: '⚔️',
      Mage: '🔮',
      Marksman: '🏹',
      Support: '🛡️',
      Tank: '🛡️'
    };
    return icons[role] || '•';
  }

  // ==================== SUBTLE SCROLL PARALLAX (Conservative Version) ====================
  private scrollListener: (() => void) | null = null;
  private prefersReducedMotion = false;

  ngAfterViewInit(): void {
    this.initScrollParallax();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initScrollParallax(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;

    if (this.prefersReducedMotion) return;

    const hero = document.querySelector('.hero') as HTMLElement;
    const crystal = document.querySelector('.hero-3d') as HTMLElement;
    const content = document.querySelector('.hero-content') as HTMLElement;

    if (!hero || !crystal || !content) return;

    let ticking = false;

    this.scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.85)));

          // Cristal se mueve muy sutilmente hacia arriba
          const crystalMove = scrollProgress * -16;
          crystal.style.transform = `translateY(${crystalMove}px)`;

          // Texto se mueve muy poco en dirección opuesta (sensación de profundidad)
          const contentMove = scrollProgress * 6;
          content.style.transform = `translateY(${contentMove}px)`;

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }
}
