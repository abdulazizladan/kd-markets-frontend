import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivitiesStore } from '../../store/activities.store';
import { ActivityFrequency, ActivityStatus } from '../../models/activity.model';

@Component({
  selector: 'app-add-activity-component',
  standalone: false,
  templateUrl: './add-activity-component.html',
  styleUrl: './add-activity-component.scss'
})
export class AddActivityComponent {

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ActivitiesStore);
  private readonly dialogRef = inject(MatDialogRef<AddActivityComponent>);

  isSubmitting = false;

  frequencyOptions = Object.values(ActivityFrequency);
  statusOptions = Object.values(ActivityStatus);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    // HTML uses type="datetime-local" which binds to a string; convert on submit
    scheduledTime: ['', Validators.required],
    frequency: [ActivityFrequency.Weekly, Validators.required],
    status: [ActivityStatus.Planned, Validators.required]
  });

  async submit() {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { name, description, scheduledTime, frequency, status } = this.form.value;

    try {
      // Convert the datetime-local string to Date
      const scheduled = new Date(scheduledTime);
      await this.store.createActivity({
        name,
        description,
        scheduledTime: scheduled,
        frequency,
        status
      });
      this.dialogRef.close(true);
    } catch (e) {
      console.error('Failed to create activity', e);
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
