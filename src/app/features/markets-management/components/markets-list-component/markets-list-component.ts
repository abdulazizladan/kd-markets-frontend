import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MarketsStore } from '../../store/markets.store';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddMarketComponent } from '../add-market-component/add-market-component';

@Component({
  selector: 'app-markets-list-component',
  standalone: false,
  templateUrl: './markets-list-component.html',
  styleUrl: './markets-list-component.scss'
})
export class MarketsListComponent implements OnInit, OnDestroy {
  private readonly store = inject(MarketsStore);
  private readonly dialog = inject(MatDialog);

  // Table columns
  displayedColumns: string[] = ['id', 'name', 'streetAddress', 'town', 'lga', 'state'];

  // Reactive state signals
  markets = this.store.filteredMarkets;
  isLoading = this.store.isLoading;
  error = this.store.error;
  allMarkets = this.store.markets;

  // Search control
  searchControl = new FormControl('');
  private sub?: Subscription;

  ngOnInit(): void {
    this.store.loadMarkets();
    this.sub = this.searchControl.valueChanges.subscribe(value => {
      this.store.setSearch(value ?? '');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openAddMarketDialog() {
    this.dialog.open(AddMarketComponent, { width: '520px' });
  }

  // KPI getters
  get totalMarkets(): number {
    return this.allMarkets().length;
  }

  get totalBuildings(): number {
    return this.allMarkets().reduce((sum, m) => sum + (m.buildings?.length ?? 0), 0);
  }

  get totalStalls(): number {
    return this.allMarkets().reduce((sum, m) => sum + (m.stalls?.length ?? 0), 0);
  }

  get totalShops(): number {
    // No shops model available yet; placeholder until model is defined
    return 0;
  }
}
