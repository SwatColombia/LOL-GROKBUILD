import { Component, OnInit } from '@angular/core';

export interface Region {
  id: string;
  name: string;
  abbreviation: string;
  status: 'online' | 'maintenance' | 'unstable';
  ping: number;
  population: string;
  recommended: boolean;
  description: string;
  flag: string;
}

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {

  regions: Region[] = [];
  filteredRegions: Region[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';

  selectedRegion: Region | null = null;

  // Verificación de instalación del juego
  gameInstalled: boolean | null = null;
  showGameCheck: boolean = true;

  ngOnInit(): void {
    this.loadRegions();
    this.loadGameInstallationStatus();
  }

  loadRegions(): void {
    this.regions = [
      {
        id: 'na1',
        name: 'North America',
        abbreviation: 'NA',
        status: 'online',
        ping: 35,
        population: 'Alta',
        recommended: true,
        description: 'Servidor principal de Norteamérica. Buena comunidad y baja latencia para jugadores de USA y Canadá.',
        flag: '🇺🇸'
      },
      {
        id: 'euw1',
        name: 'Europe West',
        abbreviation: 'EUW',
        status: 'online',
        ping: 28,
        population: 'Muy Alta',
        recommended: true,
        description: 'El servidor más poblado de Europa. Excelente para jugadores de España, Francia, Alemania y UK.',
        flag: '🇪🇺'
      },
      {
        id: 'eun1',
        name: 'Europe Nordic & East',
        abbreviation: 'EUNE',
        status: 'online',
        ping: 45,
        population: 'Alta',
        recommended: false,
        description: 'Servidor para Europa del Norte y Este. Incluye países nórdicos y del este de Europa.',
        flag: '🇸🇪'
      },
      {
        id: 'kr',
        name: 'Korea',
        abbreviation: 'KR',
        status: 'online',
        ping: 12,
        population: 'Muy Alta',
        recommended: false,
        description: 'El servidor más competitivo del mundo. Aquí juegan los mejores jugadores profesionales.',
        flag: '🇰🇷'
      },
      {
        id: 'br1',
        name: 'Brazil',
        abbreviation: 'BR',
        status: 'online',
        ping: 42,
        population: 'Alta',
        recommended: true,
        description: 'Servidor oficial de Brasil. Gran comunidad y ambiente muy activo.',
        flag: '🇧🇷'
      },
      {
        id: 'lan',
        name: 'Latin America North',
        abbreviation: 'LAN',
        status: 'online',
        ping: 55,
        population: 'Media',
        recommended: true,
        description: 'Servidor para México, Centroamérica y el norte de Sudamérica. Ideal para jugadores hispanohablantes.',
        flag: '🌎'
      },
      {
        id: 'las',
        name: 'Latin America South',
        abbreviation: 'LAS',
        status: 'online',
        ping: 68,
        population: 'Media',
        recommended: false,
        description: 'Servidor para Sudamérica (Argentina, Chile, Colombia, Perú, etc.).',
        flag: '🌎'
      },
      {
        id: 'jp1',
        name: 'Japan',
        abbreviation: 'JP',
        status: 'maintenance',
        ping: 18,
        population: 'Baja',
        recommended: false,
        description: 'Servidor japonés. Actualmente en mantenimiento programado.',
        flag: '🇯🇵'
      },
      {
        id: 'tr1',
        name: 'Turkey',
        abbreviation: 'TR',
        status: 'unstable',
        ping: 52,
        population: 'Alta',
        recommended: false,
        description: 'Servidor de Turquía. Reportes recientes de inestabilidad.',
        flag: '🇹🇷'
      },
      {
        id: 'ru',
        name: 'Russia',
        abbreviation: 'RU',
        status: 'online',
        ping: 48,
        population: 'Alta',
        recommended: false,
        description: 'Servidor ruso. Gran comunidad y partidas rápidas.',
        flag: '🇷🇺'
      },
      {
        id: 'oc1',
        name: 'Oceania',
        abbreviation: 'OCE',
        status: 'online',
        ping: 85,
        population: 'Baja',
        recommended: false,
        description: 'Servidor para Australia y Nueva Zelanda. Latencia alta desde Latinoamérica.',
        flag: '🇦🇺'
      },
      {
        id: 'ph',
        name: 'Philippines',
        abbreviation: 'PH',
        status: 'online',
        ping: 22,
        population: 'Media',
        recommended: false,
        description: 'Servidor de Filipinas. Muy activo en la escena competitiva del Sudeste Asiático.',
        flag: '🇵🇭'
      }
    ];

    this.filteredRegions = [...this.regions];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(filter: string): void {
    this.statusFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.regions];

    // Filtro por texto
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(region =>
        region.name.toLowerCase().includes(term) ||
        region.abbreviation.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.statusFilter !== 'all') {
      result = result.filter(region => region.status === this.statusFilter);
    }

    this.filteredRegions = result;
  }

  selectRegion(region: Region): void {
    this.selectedRegion = region;
    // Guardamos la región seleccionada en localStorage (útil para futuras features)
    localStorage.setItem('selected_region', JSON.stringify(region));
  }

  closeDetail(): void {
    this.selectedRegion = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'maintenance': return '#FFC107';
      case 'unstable': return '#E84C3D';
      default: return '#A09B8C';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'online': return 'Operativo';
      case 'maintenance': return 'Mantenimiento';
      case 'unstable': return 'Inestable';
      default: return 'Desconocido';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'online': return '🟢';
      case 'maintenance': return '🟡';
      case 'unstable': return '🔴';
      default: return '⚪';
    }
  }

  // ==================== VERIFICACIÓN DE CLIENTE DE LEAGUE OF LEGENDS ====================

  private loadGameInstallationStatus(): void {
    const savedStatus = localStorage.getItem('lol_game_installed');
    if (savedStatus !== null) {
      this.gameInstalled = savedStatus === 'true';
      this.showGameCheck = false; // Ocultar la verificación si ya respondió antes
    }
  }

  setGameInstalled(installed: boolean): void {
    this.gameInstalled = installed;
    localStorage.setItem('lol_game_installed', installed.toString());
    this.showGameCheck = false;

    // Opcional: si tienen una región seleccionada, mostrar mensaje especial
    if (installed && this.selectedRegion) {
      // Podemos mostrar un toast o simplemente dejar que el modal lo maneje
    }
  }

  resetGameCheck(): void {
    this.gameInstalled = null;
    this.showGameCheck = true;
    localStorage.removeItem('lol_game_installed');
  }

  getGameStatusMessage(): string {
    if (this.gameInstalled === true) {
      return '¡Excelente! Podrás unirte a partidas directamente desde aquí (simulado).';
    } else if (this.gameInstalled === false) {
      return 'No hay problema. Puedes seguir explorando campeones, regiones y el meta del juego.';
    }
    return '';
  }
}
