import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TwitchStream {
  id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  language: string;
  started_at: string;
  game_name?: string;   // Added to help with league detection
}

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  // League of Legends Game ID
  private readonly LEAGUE_GAME_ID = '21779';

  // ⚠️ IMPORTANT: For production you should NEVER expose secrets in frontend.
  // This is a temporary solution using a public CORS proxy for demo purposes.
  private readonly CORS_PROXY = 'https://corsproxy.io/?';

  constructor(private http: HttpClient) {}

  /**
   * Get real live streams from Twitch Helix API (League of Legends category)
   * @param clientId Your Twitch App Client ID
   * @param accessToken A valid App Access Token
   */
  getLiveLeagueStreams(clientId: string, accessToken: string, limit: number = 12): Observable<TwitchStream[]> {
    const url = `https://api.twitch.tv/helix/streams?game_id=${this.LEAGUE_GAME_ID}&first=${limit}`;

    const headers = new HttpHeaders({
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`
    });

    // Using CORS proxy for frontend-only demo
    const proxiedUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;

    return this.http.get<any>(proxiedUrl, { headers }).pipe(
      map(response => {
        // If Twitch returns an error object (even with 200 from proxy sometimes)
        if (response && response.error) {
          throw response;
        }
        return response.data || [];
      }),
      catchError(err => {
        console.error('Twitch API Error Details:', err);
        // Re-throw so the component can show the real error
        throw err;
      })
    );
  }

  /**
   * Helper to get a temporary App Access Token (requires Client Secret)
   * This should ideally be done on a backend.
   */
  getAppAccessToken(clientId: string, clientSecret: string): Observable<string | null> {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

    const proxiedUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;

    return this.http.post<any>(proxiedUrl, {}).pipe(
      map(res => res.access_token || null),
      catchError(err => {
        console.error('Error getting Twitch token:', err);
        return of(null);
      })
    );
  }

  // Convert Twitch thumbnail template to real URL
  getThumbnailUrl(thumbnailTemplate: string, width: number = 320, height: number = 180): string {
    return thumbnailTemplate
      .replace('{width}', width.toString())
      .replace('{height}', height.toString());
  }
}
