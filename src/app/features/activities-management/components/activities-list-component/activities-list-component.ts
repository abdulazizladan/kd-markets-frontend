import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesStore } from '../../store/activities.store';
import { ActivityStatus, ActivityFrequency } from '../../models/activity.model';
import { AddActivityComponent } from '../add-activity-component/add-activity-component';

@Component({
  selector: 'app-activities-list-component',
  standalone: false,
  templateUrl: './activities-list-component.html',
  styleUrls: ['./activities-list-component.scss']
})
export class ActivitiesListComponent implements OnInit, OnDestroy {


    private readonly store = inject(ActivitiesStore);
    private readonly dialog = inject(MatDialog);


  // Table columns
  displayedColumns: string[] = ['name', 'description', 'scheduledTime', 'frequency', 'status', 'lastCompleted', 'actions'];

  // Reactive state signals from store
  activities = this.store.filteredActivities;
  isLoading = this.store.isLoading;
  error = this.store.error;
  search = this.store.search;
  filters = this.store.filters;
  pagination = this.store.pagination;

  // Computed properties from store
  totalActivities = this.store.totalActivities;
  totalPlanned = this.store.totalPlanned;
  totalInProgress = this.store.totalInProgress;
  totalCompleted = this.store.totalCompleted;
  totalOverdue = this.store.totalOverdue;
  hasNextPage = this.store.hasNextPage;
  hasPreviousPage = this.store.hasPreviousPage;

  // Form controls
  searchControl = new FormControl('');
  statusFilterControl = new FormControl<ActivityStatus | null>(null);
  frequencyFilterControl = new FormControl<ActivityFrequency | null>(null);

  // Filter options
  statusOptions = Object.values(ActivityStatus);
  frequencyOptions = Object.values(ActivityFrequency);

  private sub?: Subscription;

  ngOnInit(): void {
    // Load initial activities
    this.store.loadActivities();

    // Live search
    this.sub = this.searchControl.valueChanges.subscribe((value) => {
      //this.store.setSearch(value ?? '');
    });

    // Status filter
    this.statusFilterControl.valueChanges.subscribe((status) => {
      //this.store.setStatusFilter(status);
    });

    // Frequency filter
    this.frequencyFilterControl.valueChanges.subscribe((frequency) => {
      //this.store.setFrequencyFilter(frequency);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Pagination methods
  async nextPage() {
    await this.store.nextPage();
  }

  async previousPage() {
    //await this.store.previousPage();
  }

  async goToPage(page: number) {
    //await this.store.goToPage(page);
  }

  // Filter methods
  clearFilters() {
    //this.store.clearFilters();
    this.searchControl.setValue('');
    this.statusFilterControl.setValue(null);
    this.frequencyFilterControl.setValue(null);
  }

  // CRUD operations
  openAddActivityDialog() {
    this.dialog.open(AddActivityComponent, {
      width: '600px'
    });
  }

  async updateActivityStatus(activityId: string, newStatus: ActivityStatus) {
    try {
      await this.store.updateActivityStatus(activityId, newStatus);
    } catch (error) {
      console.error('Failed to update activity status:', error);
    }
  }

  async markActivityCompleted(activityId: string) {
    try {
      await this.store.markActivityCompleted(activityId);
    } catch (error) {
      console.error('Failed to mark activity as completed:', error);
    }
  }

  async deleteActivity(activityId: string) {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await this.store.deleteActivity(activityId);
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  }

  // Utility methods
  getStatusColor(status: ActivityStatus): string {
    switch (status) {
      case ActivityStatus.Planned:
        return 'status--planned';
      case ActivityStatus.InProgress:
        return 'status--in-progress';
      case ActivityStatus.Completed:
        return 'status--completed';
      case ActivityStatus.Overdue:
        return 'status--overdue';
      default:
        return 'status--default';
    }
  }

  getFrequencyIcon(frequency: ActivityFrequency): string {
    switch (frequency) {
      case ActivityFrequency.Daily:
        return 'schedule';
      case ActivityFrequency.Weekly:
        return 'view_week';
      case ActivityFrequency.Monthly:
        return 'calendar_month';
      case ActivityFrequency.Quarterly:
        return 'calendar_view_month';
      case ActivityFrequency.Yearly:
        return 'event';
      case ActivityFrequency.AdHoc:
        return 'event_note';
      default:
        return 'schedule';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  clearError() {
    //this.store.clearError();
  }
}
