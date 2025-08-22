import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MarketsService } from '../../services/markets-service';
import { MarketsStore } from '../../store/markets.store';

@Component({
  selector: 'app-add-market-component',
  standalone: false,
  templateUrl: './add-market-component.html',
  styleUrl: './add-market-component.scss'
})
export class AddMarketComponent {
  private readonly fb = inject(FormBuilder);
  private readonly marketsService = inject(MarketsService);
  private readonly marketsStore = inject(MarketsStore);
  private readonly dialogRef = inject(MatDialogRef<AddMarketComponent>);

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    streetAddress: [''],
    town: [''],
    lga: [''],
    state: [''],
  });

  async onSubmit() {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { name, streetAddress, town, lga, state } = this.form.value;

    const payload = {
      name,
      address: {
        streetAddress,
        town,
        lga,
        state,
      },
      buildings: [],
      stalls: [],
    } as any;

    try {
      await this.marketsService.createMarket(payload);
      await this.marketsStore.loadMarkets();
      this.dialogRef.close(true);
    } catch (e) {
      console.error('Failed to create market', e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
