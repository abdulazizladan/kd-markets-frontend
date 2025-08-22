import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MarketsStore } from '../../store/markets.store';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-details-component',
  standalone: false,
  templateUrl: './market-details-component.html',
  styleUrl: './market-details-component.scss'
})
export class MarketDetailsComponent implements OnInit, OnDestroy {
  private readonly store = inject(MarketsStore);

  // Reactive state
  markets = this.store.filteredMarkets;
  isLoading = this.store.isLoading;
  error = this.store.error;

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
}
