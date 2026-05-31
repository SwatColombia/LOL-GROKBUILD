import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Champion, ChampionDetail, ChampionsResponse } from '../models/champion.model';

@Injectable({
  providedIn: 'root'
})
export class LegendsService {

  private readonly VERSION = '16.11.1';
  private readonly BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${this.VERSION}`;
  private readonly DATA_URL = `${this.BASE_URL}/data/en_US`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los campeones (lista resumida)
   */
  getAllChampions(): Observable<Champion[]> {
    return this.http.get<ChampionsResponse>(`${this.DATA_URL}/champion.json`).pipe(
      map(response => {
        return Object.values(response.data).map((champ: any) => ({
          id: champ.id,
          key: champ.key,
          name: champ.name,
          title: champ.title,
          blurb: champ.blurb,
          tags: champ.tags,
          info: champ.info,
          image: champ.image,
          version: response.version
        } as Champion));
      })
    );
  }

  /**
   * Obtiene el detalle completo de un campeón por su ID (ej: "Aatrox")
   */
  getChampionDetail(championId: string): Observable<ChampionDetail> {
    return this.http.get<any>(`${this.DATA_URL}/champion/${championId}.json`).pipe(
      map(response => {
        const champ = Object.values(response.data)[0] as any;

        return {
          id: champ.id,
          key: champ.key,
          name: champ.name,
          title: champ.title,
          blurb: champ.blurb,
          lore: champ.lore,
          tags: champ.tags,
          info: champ.info,
          image: champ.image,
          allytips: champ.allytips,
          enemytips: champ.enemytips,
          passive: champ.passive,
          spells: champ.spells,
          skins: champ.skins,
          version: response.version
        } as ChampionDetail;
      })
    );
  }

  /**
   * Devuelve la URL de la imagen del ícono del campeón
   */
  getChampionIconUrl(championId: string): string {
    return `${this.BASE_URL}/img/champion/${championId}.png`;
  }

  /**
   * Devuelve la URL de la imagen de carga (loading screen)
   */
  getChampionLoadingUrl(championId: string, skinNum: number = 0): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_${skinNum}.jpg`;
  }

  /**
   * Devuelve la URL de la splash art
   */
  getChampionSplashUrl(championId: string, skinNum: number = 0): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
  }

  /**
   * Devuelve la URL del ícono de un hechizo
   */
  getSpellIconUrl(spellImageFull: string): string {
    return `${this.BASE_URL}/img/spell/${spellImageFull}`;
  }

  /**
   * Devuelve la URL del ícono de la pasiva
   */
  getPassiveIconUrl(passiveImageFull: string): string {
    return `${this.BASE_URL}/img/passive/${passiveImageFull}`;
  }
}
