import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TwitchService, TwitchStream } from '../../../services/twitch.service';

interface LiveStream {
  id: number;
  channel: string;
  title: string;
  viewers: number;
  language: string;
  league: string;
  thumbnail: string;
}

interface UpcomingEvent {
  id: number;
  league: string;
  match: string;
  date: string;
  time: string;
  teams: string[];
  tournament: string;
}

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {

  liveStreams: LiveStream[] = [];
  upcomingEvents: UpcomingEvent[] = [];
  filteredStreams: LiveStream[] = [];

  selectedStream: LiveStream | null = null;
  showStreamModal = false;

  activeFilter: string = 'all';
  searchTerm: string = '';

  // Twitch API credentials (stored in localStorage for convenience)
  twitchClientId: string = '';
  twitchAccessToken: string = '';
  isUsingRealTwitch = false;
  isLoadingStreams = false;
  twitchError: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private twitchService: TwitchService
  ) {}

  ngOnInit(): void {
    this.loadStoredCredentials();
    this.loadUpcomingEvents();

    if (this.twitchClientId && this.twitchAccessToken) {
      this.fetchRealStreams();
    } else {
      this.loadMockStreams();
    }
  }

  private loadStoredCredentials(): void {
    this.twitchClientId = localStorage.getItem('twitch_client_id') || '';
    this.twitchAccessToken = localStorage.getItem('twitch_access_token') || '';
  }

  saveCredentials(): void {
    localStorage.setItem('twitch_client_id', this.twitchClientId);
    localStorage.setItem('twitch_access_token', this.twitchAccessToken);

    if (this.twitchClientId && this.twitchAccessToken) {
      this.fetchRealStreams();
    }
  }

  clearCredentials(): void {
    localStorage.removeItem('twitch_client_id');
    localStorage.removeItem('twitch_access_token');
    this.twitchClientId = '';
    this.twitchAccessToken = '';
    this.isUsingRealTwitch = false;
    this.loadMockStreams();
  }

  fetchRealStreams(): void {
    if (!this.twitchClientId || !this.twitchAccessToken) return;

    this.isLoadingStreams = true;
    this.twitchError = '';

    this.twitchService.getLiveLeagueStreams(
      this.twitchClientId,
      this.twitchAccessToken,
      15
    ).subscribe({
      next: (streams: TwitchStream[]) => {
        this.isLoadingStreams = false;

        if (streams.length === 0) {
          this.twitchError = 'La API respondió OK, pero no devolvió streams de LoL ahora mismo. Esto puede pasar si no hay nadie transmitiendo en este momento o si el token tiene restricciones.';
          this.loadMockStreams();
          return;
        }

        this.liveStreams = streams.map((stream: any) => ({
          id: parseInt(stream.id),
          channel: stream.user_name,
          title: stream.title,
          viewers: stream.viewer_count,
          language: stream.language,
          league: this.detectLeague(stream.title, stream.game_name),
          thumbnail: this.twitchService.getThumbnailUrl(stream.thumbnail_url)
        }));

        this.filteredStreams = [...this.liveStreams];
        this.isUsingRealTwitch = true;
      },
      error: (err) => {
        this.isLoadingStreams = false;
        console.error('Full Twitch Error Object:', err);

        const status = err?.status || err?.error?.status;
        const message = err?.error?.message || err?.message || 'Error desconocido';

        if (status === 401 || message.includes('Unauthorized') || message.includes('invalid')) {
          this.twitchError = `Error de autenticación (401): El Access Token es inválido o expiró. Genera uno nuevo en twitchtokengenerator.com (App Access Token).`;
        } else if (status === 403) {
          this.twitchError = `Error 403: El Client ID o el token no tiene permisos. Verifica que estés usando un App Access Token.`;
        } else {
          this.twitchError = `Error al llamar a Twitch: ${message} (Status: ${status || 'desconocido'})`;
        }

        this.loadMockStreams();
      }
    });
  }

  private detectLeague(title: string, gameName?: string): string {
    const t = (title || '').toUpperCase();
    const game = (gameName || '').toUpperCase();

    // Detectar ligas profesionales
    if (t.includes('LCK') || game.includes('LCK')) return 'LCK';
    if (t.includes('LEC') || game.includes('LEC')) return 'LEC';
    if (t.includes('LCS') || game.includes('LCS')) return 'LCS';
    if (t.includes('LPL') || game.includes('LPL')) return 'LPL';

    // Eventos internacionales
    if (t.includes('MSI') || t.includes('WORLDS') || t.includes('ALL STAR') || t.includes('EWC')) {
      return 'International';
    }

    // Cualquier stream que sea de League of Legends (incluye streamers normales como "les")
    if (game.includes('LEAGUE') || game.includes('LEGENDS') || game.includes('LOL')) {
      return 'Streamers';
    }

    return 'Other';
  }

  private loadMockStreams(): void {
    // Keep the original mock data as fallback
    this.liveStreams = [
      {
        id: 1,
        channel: 'LCK',
        title: 'GEN vs T1 - LCK Summer Split',
        viewers: 245000,
        language: 'ko',
        league: 'LCK',
        thumbnail: 'https://picsum.photos/id/1015/320/180'
      },
      {
        id: 2,
        channel: 'LEC',
        title: 'G2 vs Fnatic - LEC Summer Playoffs',
        viewers: 128000,
        language: 'en',
        league: 'LEC',
        thumbnail: 'https://picsum.photos/id/1016/320/180'
      },
      {
        id: 3,
        channel: 'LCS',
        title: 'TL vs 100T - LCS Summer Split',
        viewers: 87000,
        language: 'en',
        league: 'LCS',
        thumbnail: 'https://picsum.photos/id/1033/320/180'
      },
      {
        id: 4,
        channel: 'LPL',
        title: 'JD Gaming vs RNG - LPL Summer',
        viewers: 312000,
        language: 'zh',
        league: 'LPL',
        thumbnail: 'https://picsum.photos/id/1040/320/180'
      },
      {
        id: 5,
        channel: 'Caedrel',
        title: 'LCK Co-Stream - GEN vs T1',
        viewers: 95000,
        language: 'en',
        league: 'LCK',
        thumbnail: 'https://picsum.photos/id/106/320/180'
      }
    ];
    this.filteredStreams = [...this.liveStreams];
    this.isUsingRealTwitch = false;
  }

  private loadUpcomingEvents(): void {
    this.upcomingEvents = [
      {
        id: 1,
        league: 'Worlds 2025',
        match: 'Semifinal 1',
        date: '2025-10-25',
        time: '12:00',
        teams: ['T1', 'GEN.G'],
        tournament: 'World Championship'
      },
      {
        id: 2,
        league: 'LEC',
        match: 'Grand Final',
        date: '2025-09-07',
        time: '18:00',
        teams: ['G2 Esports', 'Fnatic'],
        tournament: 'LEC Summer Playoffs'
      },
      {
        id: 3,
        league: 'LCK',
        match: 'Final',
        date: '2025-09-14',
        time: '11:00',
        teams: ['GEN.G', 'KT Rolster'],
        tournament: 'LCK Summer Split'
      }
    ];
  }

  private loadMockData(): void {
    // Mock live streams (real data would come from Twitch API)
    this.liveStreams = [
      {
        id: 1,
        channel: 'LCK',
        title: 'GEN vs T1 - LCK Summer Split',
        viewers: 245000,
        language: 'ko',
        league: 'LCK',
        thumbnail: 'https://picsum.photos/id/1015/320/180'
      },
      {
        id: 2,
        channel: 'LEC',
        title: 'G2 vs Fnatic - LEC Summer Playoffs',
        viewers: 128000,
        language: 'en',
        league: 'LEC',
        thumbnail: 'https://picsum.photos/id/1016/320/180'
      },
      {
        id: 3,
        channel: 'LCS',
        title: 'TL vs 100T - LCS Summer Split',
        viewers: 87000,
        language: 'en',
        league: 'LCS',
        thumbnail: 'https://picsum.photos/id/1033/320/180'
      },
      {
        id: 4,
        channel: 'LPL',
        title: 'JD Gaming vs RNG - LPL Summer',
        viewers: 312000,
        language: 'zh',
        league: 'LPL',
        thumbnail: 'https://picsum.photos/id/1040/320/180'
      },
      {
        id: 5,
        channel: 'Caedrel',
        title: 'LCK Co-Stream - GEN vs T1',
        viewers: 95000,
        language: 'en',
        league: 'LCK',
        thumbnail: 'https://picsum.photos/id/106/320/180'
      }
    ];

    this.filteredStreams = [...this.liveStreams];

    // Mock upcoming events
    this.upcomingEvents = [
      {
        id: 1,
        league: 'Worlds 2025',
        match: 'Semifinal 1',
        date: '2025-10-25',
        time: '12:00',
        teams: ['T1', 'GEN.G'],
        tournament: 'World Championship'
      },
      {
        id: 2,
        league: 'LEC',
        match: 'Grand Final',
        date: '2025-09-07',
        time: '18:00',
        teams: ['G2 Esports', 'Fnatic'],
        tournament: 'LEC Summer Playoffs'
      },
      {
        id: 3,
        league: 'LCK',
        match: 'Final',
        date: '2025-09-14',
        time: '11:00',
        teams: ['GEN.G', 'KT Rolster'],
        tournament: 'LCK Summer Split'
      },
      {
        id: 4,
        league: 'LPL',
        match: 'Semifinal',
        date: '2025-09-20',
        time: '10:00',
        teams: ['JD Gaming', 'Top Esports'],
        tournament: 'LPL Summer Playoffs'
      }
    ];
  }

  filterStreams(league: string): void {
    this.activeFilter = league;

    if (league === 'all') {
      this.filteredStreams = [...this.liveStreams];
    } else {
      // Support both old "Other" and new "Streamers" for compatibility
      this.filteredStreams = this.liveStreams.filter(s => 
        s.league === league || 
        (league === 'Streamers' && s.league === 'Other')
      );
    }

    // Apply search if there's a term
    if (this.searchTerm) {
      this.applySearch();
    }
  }

  onSearch(): void {
    this.applySearch();
  }

  private applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();

    let baseList = this.activeFilter === 'all' 
      ? this.liveStreams 
      : this.liveStreams.filter(s => s.league === this.activeFilter);

    this.filteredStreams = baseList.filter(stream =>
      stream.title.toLowerCase().includes(term) ||
      stream.channel.toLowerCase().includes(term)
    );
  }

  openStream(stream: LiveStream): void {
    this.selectedStream = stream;
    this.showStreamModal = true;
    // In a real app, we would dynamically load the Twitch embed here
  }

  closeStreamModal(): void {
    this.showStreamModal = false;
    this.selectedStream = null;
  }

  getSafeTwitchUrl(channel: string): SafeResourceUrl {
    const url = `https://player.twitch.tv/?channel=${channel}&parent=localhost&autoplay=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getLeagueColor(league: string): string {
    switch (league) {
      case 'LCK': return '#00A0E9';
      case 'LEC': return '#FF4655';
      case 'LCS': return '#00B5E2';
      case 'LPL': return '#FF6B35';
      default: return '#C8AA6E';
    }
  }
}
