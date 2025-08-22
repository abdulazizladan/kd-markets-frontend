import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { MarketsService } from '../services/markets-service';
import { Market } from '../models/market.model';

export interface MarketsState {
  markets: Market[];
  selectedMarket: Market | null;
  isLoading: boolean;
  error: string | null;
  search: string;
}

export const initialState: MarketsState = {
  markets: [],
  selectedMarket: null,
  isLoading: false,
  error: null,
  search: ''
};

export const MarketsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    markets: computed(() => state.markets()),
    selectedMarket: computed(() => state.selectedMarket()),
    isLoading: computed(() => state.isLoading()),
    error: computed(() => state.error()),
    search: computed(() => state.search()),
    filteredMarkets: computed(() => {
      const term = state.search().trim().toLowerCase();
      if (!term) return state.markets();
      return state.markets().filter(m =>
        m.name.toLowerCase().includes(term) ||
        String(m.id).includes(term) ||
        m.address?.streetAddress?.toLowerCase?.().includes(term) ||
        m.address?.town?.toLowerCase?.().includes(term) ||
        m.address?.lga?.toLowerCase?.().includes(term) ||
        m.address?.state?.toLowerCase?.().includes(term)
      );
    })
  })),
  withMethods((store, marketsService = inject(MarketsService)) => ({
    async loadMarkets() {
      patchState(store, { isLoading: true, error: null });
      try {
        const list = await marketsService.getAll();
        patchState(store, { markets: list, isLoading: false });
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to load markets' });
      }
    },

    async loadMarketById(id: string) {
      patchState(store, { isLoading: true, error: null });
      try {
        const market = await marketsService.getByID(id);
        patchState(store, { selectedMarket: market, isLoading: false });
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to load market' });
      }
    },

    async createMarket(payload: Partial<Market>) {
      patchState(store, { isLoading: true, error: null });
      try {
        const created = await marketsService.createMarket(payload);
        patchState(store, { markets: [created, ...store.markets()], isLoading: false });
        return created;
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to create market' });
        throw error;
      }
    },

    async updateMarket(id: string, changes: Partial<Market>) {
      patchState(store, { isLoading: true, error: null });
      try {
        const updated = await marketsService.updateByID(id, changes);
        patchState(store, {
          markets: store.markets().map(m => (String(m.id) === String(id) ? { ...m, ...updated } : m)),
          selectedMarket:
            store.selectedMarket() && String(store.selectedMarket()!.id) === String(id)
              ? { ...store.selectedMarket()!, ...updated }
              : store.selectedMarket(),
          isLoading: false,
        });
        return updated;
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to update market' });
        throw error;
      }
    },

    async removeMarket(id: string) {
      patchState(store, { isLoading: true, error: null });
      try {
        await marketsService.removeByID(id);
        patchState(store, {
          markets: store.markets().filter(m => String(m.id) !== String(id)),
          selectedMarket:
            store.selectedMarket() && String(store.selectedMarket()!.id) === String(id) ? null : store.selectedMarket(),
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to remove market' });
        throw error;
      }
    },

    setSearch(value: string) {
      patchState(store, { search: value });
    },

    clearError() {
      patchState(store, { error: null });
    },
  }))
);