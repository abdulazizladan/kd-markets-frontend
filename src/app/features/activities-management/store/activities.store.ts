import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { ActivitiesService, CreateActivityRequest, UpdateActivityRequest, ActivitiesQueryParams } from '../services/activities-service';
import { Activity, ActivityStatus, ActivityFrequency } from '../models/activity.model';
import { firstValueFrom } from 'rxjs';

export interface ActivitiesState {
  activities: Activity[];
  selectedActivity: Activity | null;
  isLoading: boolean;
  error: string | null;
  search: string;
}

const initialState: ActivitiesState = {
  activities: [],
  selectedActivity: null,
  isLoading: false,
  error: null,
  search: ''
};

export const ActivitiesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    // Computed properties for filtered activities
    filteredActivities: computed(() => {
      let filtered = state.activities() || [];
      
      // Apply search filter
      const searchTerm = state.search().trim().toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(activity =>
          activity.name.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    }),

    // Computed properties for different activity statuses
    plannedActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.status === ActivityStatus.Planned)
    ),

    inProgressActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.status === ActivityStatus.InProgress)
    ),

    completedActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.status === ActivityStatus.Completed)
    ),

    overdueActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.status === ActivityStatus.Overdue)
    ),

    // Computed properties for different frequencies
    dailyActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.frequency === ActivityFrequency.Daily)
    ),

    weeklyActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.frequency === ActivityFrequency.Weekly)
    ),

    monthlyActivities: computed(() => 
      (state.activities() || []).filter(activity => activity.frequency === ActivityFrequency.Monthly)
    ),

    // Computed properties for activity counts
    totalActivities: computed(() => state.activities()?.length || 0),
    totalPlanned: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Planned)?.length || 0),
    totalInProgress: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.InProgress)?.length || 0),
    totalCompleted: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Completed)?.length || 0),
    totalOverdue: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Overdue)?.length || 0)
  })),
  withMethods((store, activitiesService = inject(ActivitiesService)) => ({
    // Set search term
    setSearch(search: string) {
      patchState(store, { search });
    },

    // Load activities with optional search
    async loadActivities(params?: ActivitiesQueryParams) {
      console.log('Store: Loading activities with params:', params);
      console.log('Store: Current state before loading:', {
        activities: store.activities(),
        isLoading: store.isLoading(),
        error: store.error()
      });

      patchState(store, { isLoading: true, error: null });

      try {
        console.log('Store: Making API call to getAllActivities...');
        
        const activities = await firstValueFrom(activitiesService.getAllActivities(params));
        console.log('Store: API response received:', activities);
        console.log('Store: Response activities array:', activities);
        console.log('Store: Response activities length:', activities?.length);
        
        patchState(store, {
          activities: activities || [],
          isLoading: false
        });

        console.log('Store: State updated with activities:', store.activities());
        console.log('Store: New activities length:', store.activities().length);

        // Update search if provided
        if (params?.search !== undefined) {
          patchState(store, { search: params.search });
        }
      } catch (error: any) {
        console.error('Store: Error loading activities:', error);
        console.error('Store: Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          stack: error.stack
        });
        
        patchState(store, {
          error: error.message || 'Failed to load activities',
          isLoading: false
        });
      }
    },

    // Load single activity by ID
    async loadActivityById(id: string) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const activity = await firstValueFrom(activitiesService.getActivityById(id));
        
        patchState(store, {
          selectedActivity: activity,
          isLoading: false
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load activity',
          isLoading: false
        });
      }
    },

    // Create new activity
    async createActivity(activity: CreateActivityRequest) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const created = await firstValueFrom(activitiesService.createActivity(activity));
        
        // Add to current activities list
        const currentActivities = store.activities() || [];
        patchState(store, {
          activities: [created, ...currentActivities],
          isLoading: false
        });

        return created;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to create activity',
          isLoading: false
        });
        throw error;
      }
    },

    // Update existing activity
    async updateActivity(id: string, updates: UpdateActivityRequest) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const updated = await firstValueFrom(activitiesService.updateActivity(id, updates));
        
        // Update in activities list
        const currentActivities = store.activities() || [];
        const updatedActivities = currentActivities.map(activity =>
          activity.id === id ? updated : activity
        );
        
        patchState(store, {
          activities: updatedActivities,
          selectedActivity: store.selectedActivity()?.id === id ? updated : store.selectedActivity(),
          isLoading: false
        });

        return updated;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to update activity',
          isLoading: false
        });
        throw error;
      }
    },

    // Update activity status
    async updateActivityStatus(id: string, status: ActivityStatus) {
      try {
        const updated = await firstValueFrom(activitiesService.updateActivityStatus(id, status));
        
        // Update in activities list
        const currentActivities = store.activities() || [];
        const updatedActivities = currentActivities.map(activity =>
          activity.id === id ? updated : activity
        );
        
        patchState(store, {
          activities: updatedActivities,
          selectedActivity: store.selectedActivity()?.id === id ? updated : store.selectedActivity()
        });

        return updated;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to update activity status'
        });
        throw error;
      }
    },

    // Mark activity as completed
    async markActivityCompleted(id: string, completionDate?: Date) {
      try {
        const updated = await firstValueFrom(activitiesService.markActivityCompleted(id, completionDate));
        
        // Update in activities list
        const currentActivities = store.activities() || [];
        const updatedActivities = currentActivities.map(activity =>
          activity.id === id ? updated : activity
        );
        
        patchState(store, {
          activities: updatedActivities,
          selectedActivity: store.selectedActivity()?.id === id ? updated : store.selectedActivity()
        });

        return updated;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to mark activity as completed'
        });
        throw error;
      }
    },

    // Delete activity
    async deleteActivity(id: string) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        await firstValueFrom(activitiesService.deleteActivity(id));
        
        // Remove from activities list
        const currentActivities = store.activities() || [];
        const filteredActivities = currentActivities.filter(activity => activity.id !== id);
        
        patchState(store, {
          activities: filteredActivities,
          selectedActivity: store.selectedActivity()?.id === id ? null : store.selectedActivity(),
          isLoading: false
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to delete activity',
          isLoading: false
        });
        throw error;
      }
    },

    // Utility method to clear activities
    clearActivities() {
      patchState(store, {
        activities: [],
        selectedActivity: null
      });
    },

    // Clear error
    clearError() {
      patchState(store, { error: null });
    }
  }))
)
