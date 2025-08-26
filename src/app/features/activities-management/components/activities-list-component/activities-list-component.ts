import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  private readonly http = inject(HttpClient);

  // Test HTTP connectivity
  async testHttpConnection() {
    try {
      console.log('Component: Testing HTTP connection to backend...');
      const response = await firstValueFrom(this.http.get('https://kd-markets-backend.onrender.com/'));
      console.log('Component: HTTP test successful:', response);
    } catch (error) {
      console.error('Component: HTTP test failed:', error);
    }
  }

  // Table columns
  displayedColumns: string[] = ['name', 'description', 'scheduledTime', 'frequency', 'status', 'lastCompleted', 'actions'];

  // Reactive state signals from store
  activities = this.store.activities;
  filteredActivities = this.store.filteredActivities;
  isLoading = this.store.isLoading;
  error = this.store.error;
  search = this.store.search;

  // Computed properties from store
  totalActivities = this.store.totalActivities;
  totalPlanned = this.store.totalPlanned;
  totalInProgress = this.store.totalInProgress;
  totalCompleted = this.store.totalCompleted;
  totalOverdue = this.store.totalOverdue;

  // Form controls
  searchControl = new FormControl('');

  private sub?: Subscription;

  ngOnInit(): void {
    // Load initial activities
    console.log('Component: ngOnInit called');
    console.log('Component: About to call store.loadActivities()');
    
    // Test environment access
    console.log('Component: Environment check - baseUrl:', 'https://kd-markets-backend.onrender.com/');
    
    // Test HTTP connectivity first
    this.testHttpConnection();
    
    this.store.loadActivities();
    
    // Debug: Check store state after loading
    setTimeout(() => {
      console.log('Component: Store state after loading (1s delay):', {
        activities: this.store.activities(),
        totalActivities: this.store.totalActivities(),
        isLoading: this.store.isLoading(),
        error: this.store.error()
      });
    }, 1000);

    // Additional debug check after 3 seconds
    setTimeout(() => {
      console.log('Component: Store state after loading (3s delay):', {
        activities: this.store.activities(),
        totalActivities: this.store.totalActivities(),
        isLoading: this.store.isLoading(),
        error: this.store.error()
      });
    }, 3000);

    // Live search
    this.sub = this.searchControl.valueChanges.subscribe((value) => {
      this.store.setSearch(value ?? '');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Filter methods
  clearFilters() {
    this.searchControl.setValue('');
    this.store.setSearch('');
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

  getStatusOptions(): string[] {
    return Object.values(ActivityStatus);
  }

  updateActivityStatusWithType(activityId: string, statusString: string) {
    const status = statusString as ActivityStatus;
    this.updateActivityStatus(activityId, status);
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

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString();
  }

  clearError() {
    this.store.clearError();
  }
}
