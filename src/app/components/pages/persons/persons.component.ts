import { Component, OnInit } from '@angular/core';
import { LegendsService } from '../../../services/legends.service';

interface BigStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

interface RegionStat {
  name: string;
  players: string;
  percentage: number;
}

interface TopChampion {
  name: string;
  pickRate: number;
  winRate: number;
  role: string;
}

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  bigStats: BigStat[] = [];
  regionStats: RegionStat[] = [];
  topChampions: TopChampion[] = [];
  roleDistribution: any[] = [];

  loading = true;

  constructor(private legendsService: LegendsService) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    // 1. Estadísticas grandes impactantes
    this.bigStats = [
      {
        label: 'Jugadores Activos',
        value: '12.4M',
        change: '+8.2%',
        positive: true
      },
      {
        label: 'Partidas Hoy',
        value: '4.8M',
        change: '+12.5%',
        positive: true
      },
      {
        label: 'Tiempo Promedio',
        value: '32 min',
        change: '-1.3%',
        positive: false
      },
      {
        label: 'Campeón Más Jugado',
        value: 'Jinx',
        change: '+3.1%',
        positive: true
      }
    ];

    // 2. Estadísticas por Región (Top 6)
    this.regionStats = [
      { name: 'Europe West (EUW)', players: '3.2M', percentage: 26 },
      { name: 'North America (NA)', players: '2.1M', percentage: 17 },
      { name: 'Korea (KR)', players: '1.9M', percentage: 15 },
      { name: 'Brazil (BR)', players: '1.4M', percentage: 11 },
      { name: 'Latin America North (LAN)', players: '980K', percentage: 8 },
      { name: 'Europe Nordic & East (EUNE)', players: '870K', percentage: 7 }
    ];

    // 3. Campeones más jugados (mock con datos realistas)
    this.topChampions = [
      { name: 'Jinx', pickRate: 18.4, winRate: 51.2, role: 'ADC' },
      { name: 'Ahri', pickRate: 15.7, winRate: 49.8, role: 'Mid' },
      { name: 'Darius', pickRate: 14.9, winRate: 52.1, role: 'Top' },
      { name: 'Lee Sin', pickRate: 13.8, winRate: 48.3, role: 'Jungle' },
      { name: 'Lux', pickRate: 12.6, winRate: 50.5, role: 'Mid' },
      { name: 'Thresh', pickRate: 11.9, winRate: 51.7, role: 'Support' },
      { name: 'Yasuo', pickRate: 11.2, winRate: 47.9, role: 'Mid' },
      { name: 'Kai\'Sa', pickRate: 10.8, winRate: 49.4, role: 'ADC' }
    ];

    // 4. Distribución de Roles
    this.roleDistribution = [
      { role: 'ADC', percentage: 22, color: '#E84C3D' },
      { role: 'Mid', percentage: 21, color: '#4A90E2' },
      { role: 'Jungle', percentage: 20, color: '#4CAF50' },
      { role: 'Top', percentage: 19, color: '#FFC107' },
      { role: 'Support', percentage: 18, color: '#9C27B0' }
    ];

    this.loading = false;
  }
}
