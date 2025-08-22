import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Market } from '../models/market.model';
import { env } from '../../../../environment/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.baseUrl;

  createMarket(marketData: Partial<Market>): Promise<Market> {
    return firstValueFrom(this.http.post<Market>(`${this.baseUrl}properties/markets`, marketData));
  }

  getAll(): Promise<Market[]> {
    return firstValueFrom(this.http.get<Market[]>(`${this.baseUrl}properties/markets`));
  }

  getByID(id: string): Promise<Market> {
    return firstValueFrom(this.http.get<Market>(`${this.baseUrl}properties/markets/${id}`));
  }

  updateByID(id: string, marketInfo: Partial<Market>): Promise<Market> {
    return firstValueFrom(this.http.put<Market>(`${this.baseUrl}properties/markets/${id}`, marketInfo));
  }

  removeByID(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}properties/markets/${id}`));
  }
}
