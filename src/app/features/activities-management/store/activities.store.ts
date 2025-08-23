import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { ActivitiesService, ActivityResponse, CreateActivityRequest, UpdateActivityRequest, ActivitiesQueryParams, ActivitiesPaginatedResponse } from '../services/activities-service';
import { Activity, ActivityStatus, ActivityFrequency } from '../models/activity.model';
import { firstValueFrom } from 'rxjs';

export interface ActivitiesState {
  activities: ActivityResponse[];
  selectedActivity: ActivityResponse | null;
  isLoading: boolean;
  error: string | null;
  search: string;
  filters: {
    status: ActivityStatus | null;
    frequency: ActivityFrequency | null;
    marketId: string | null;
    startDate: Date | null;
    endDate: Date | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
    overdue: number;
    byFrequency: Record<ActivityFrequency, number>;
  } | null;
}

const initialState: ActivitiesState = {
  activities: [],
  selectedActivity: null,
  isLoading: false,
  error: null,
  search: '',
  filters: {
    status: null,
    frequency: null,
    marketId: null,
    startDate: null,
    endDate: null
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  stats: null
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

      // Apply status filter
      if (state.filters().status) {
        filtered = filtered.filter(activity => activity.status === state.filters().status);
      }

      // Apply frequency filter
      if (state.filters().frequency) {
        filtered = filtered.filter(activity => activity.frequency === state.filters().frequency);
      }

      // Apply market filter
      if (state.filters().marketId) {
        filtered = filtered.filter(activity => 
          // Note: This assumes activities have a marketId field
          // Adjust based on your actual data structure
          (activity as any).marketId === state.filters().marketId
        );
      }

      // Apply date range filter
      if (state.filters().startDate) {
        filtered = filtered.filter(activity => 
          new Date(activity.scheduledTime) >= state.filters().startDate!
        );
      }

      if (state.filters().endDate) {
        filtered = filtered.filter(activity => 
          new Date(activity.scheduledTime) <= state.filters().endDate!
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

    // Computed properties for pagination
    hasNextPage: computed(() => 
      state.pagination().page < state.pagination().totalPages
    ),

    hasPreviousPage: computed(() => 
      state.pagination().page > 1
    ),

    // Computed properties for activity counts
    totalActivities: computed(() => state.activities()?.length || 0),
    totalPlanned: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Planned)?.length || 0),
    totalInProgress: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.InProgress)?.length || 0),
    totalCompleted: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Completed)?.length || 0),
    totalOverdue: computed(() => state.activities()?.filter(a => a.status === ActivityStatus.Overdue)?.length || 0)
  })),
  withMethods((store, activitiesService = inject(ActivitiesService)) => ({
    // Load activities with optional filtering and pagination
    async loadActivities(params?: ActivitiesQueryParams) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const response = await firstValueFrom(activitiesService.getAllActivities(params));
        
        patchState(store, {
          activities: response.activities || [],
          pagination: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages
          },
          isLoading: false
        });

        // Update filters if provided
        if (params) {
          patchState(store, {
            filters: {
              status: params.status || null,
              frequency: params.frequency || null,
              marketId: params.marketId || null,
              startDate: params.startDate || null,
              endDate: params.endDate || null
            }
          });
        }
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load activities',
          isLoading: false
        });
      }
    },

    // Load activities by market
    async loadActivitiesByMarket(marketId: string, params?: Omit<ActivitiesQueryParams, 'marketId'>) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const response = await firstValueFrom(activitiesService.getActivitiesByMarket(marketId, params));
        
        patchState(store, {
          activities: response.activities || [],
          pagination: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages
          },
          filters: {
            ...store.filters(),
            marketId
          },
          isLoading: false
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load market activities',
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
          pagination: {
            ...store.pagination(),
            total: store.pagination().total + 1
          },
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
          pagination: {
            ...store.pagination(),
            total: store.pagination().total - 1
          },
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

    // Bulk update activities status
    async bulkUpdateStatus(activityIds: string[], status: ActivityStatus) {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const result = await firstValueFrom(activitiesService.bulkUpdateStatus(activityIds, status));
        
        // Update affected activities in the list
        const currentActivities = store.activities() || [];
        const updatedActivities = currentActivities.map(activity =>
          activityIds.includes(activity.id) 
            ? { ...activity, status }
            : activity
        );
        
        patchState(store, {
          activities: updatedActivities,
          isLoading: false
        });

        return result;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to bulk update activities',
          isLoading: false
        });
        throw error;
      }
    },

    // Load activities statistics
    async loadActivitiesStats(marketId?: string) {
      try {
        const stats = await firstValueFrom(activitiesService.getActivitiesStats(marketId));
        
        patchState(store, { stats });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load activities statistics'
        });
      }
    },

    // Load upcoming activities
    async loadUpcomingActivities(days: number = 7, marketId?: string) {
      try {
        const upcoming = await firstValueFrom(activitiesService.getUpcomingActivities(days, marketId));
        
        // You might want to store these separately or merge with main activities
        // For now, we'll just return them
        return upcoming;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load upcoming activities'
        });
        throw error;
      }
    },

    // Load overdue activities
    async loadOverdueActivities(marketId?: string) {
      try {
        const overdue = await firstValueFrom(activitiesService.getOverdueActivities(marketId));
        
        // You might want to store these separately or merge with main activities
        // For now, we'll just return them
        return overdue;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load overdue activities'
        });
        throw error;
      }
    },

    // Navigation methods for pagination
    async nextPage() {
      if (store.hasNextPage()) {
        const nextPage = store.pagination().page + 1;
        // Remove nulls from filters to satisfy ActivitiesQueryParams type
        const filters = store.filters();
        const cleanedFilters = {
          ...filters,
          status: filters.status === null ? undefined : filters.status,
          frequency: filters.frequency === null ? undefined : filters.frequency,
          marketId: filters.marketId === null ? undefined : filters.marketId,
          startDate: filters.startDate === null ? undefined : filters.startDate,
          endDate: filters.endDate === null ? undefined : filters.endDate,
        };
        await this.loadActivities({
          ...cleanedFilters,
          page: nextPage,
          limit: store.pagination().limit
        });
      }
    },

    // Utility method to clear activities
    clearActivities() {
      patchState(store, {
        activities: [],
        selectedActivity: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      });
    }
})))
