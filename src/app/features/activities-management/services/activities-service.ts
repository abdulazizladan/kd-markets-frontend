import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../../../../environment/environment';
import { Activity, ActivityStatus, ActivityFrequency } from '../models/activity.model';

// Request/Response interfaces
export interface CreateActivityRequest {
  name: string;
  description: string;
  scheduledTime: Date;
  frequency: ActivityFrequency;
  status?: ActivityStatus;
}

export interface UpdateActivityRequest {
  name?: string;
  description?: string;
  scheduledTime?: Date;
  frequency?: ActivityFrequency;
  status?: ActivityStatus;
  lastCompleted?: Date;
}

export interface ActivityResponse {
  id: string;
  name: string;
  description: string;
  scheduledTime: string; // ISO date string from backend
  frequency: ActivityFrequency;
  status: ActivityStatus;
  lastCompleted?: string; // ISO date string from backend
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesQueryParams {
  status?: ActivityStatus;
  frequency?: ActivityFrequency;
  marketId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ActivitiesPaginatedResponse {
  activities: ActivityResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  
  private readonly baseUrl = env.baseUrl;
  private readonly http = inject(HttpClient);

  /**
   * Create a new activity
   * @param activity - Activity data to create
   * @returns Observable of created activity
   */
  createActivity(activity: CreateActivityRequest): Observable<ActivityResponse> {
    const url = `${this.baseUrl}activities`;
    
    // Convert Date objects to ISO strings for backend
    const payload = {
      ...activity,
      scheduledTime: activity.scheduledTime.toISOString()
    };

    return this.http.post<ActivityResponse>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all activities with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Observable of paginated activities response
   */
  getAllActivities(params?: ActivitiesQueryParams): Observable<ActivitiesPaginatedResponse> {
    const url = `${this.baseUrl}activities`;
    
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.frequency) httpParams = httpParams.set('frequency', params.frequency);
      if (params.marketId) httpParams = httpParams.set('marketId', params.marketId);
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate.toISOString());
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate.toISOString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ActivitiesPaginatedResponse>(url, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get activities by market ID
   * @param marketId - ID of the market
   * @param params - Optional query parameters
   * @returns Observable of activities for the market
   */
  getActivitiesByMarket(marketId: string, params?: Omit<ActivitiesQueryParams, 'marketId'>): Observable<ActivitiesPaginatedResponse> {
    const url = `${this.baseUrl}markets/${marketId}/activities`;
    
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.frequency) httpParams = httpParams.set('frequency', params.frequency);
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate.toISOString());
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate.toISOString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ActivitiesPaginatedResponse>(url, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get activity by ID
   * @param id - Activity ID
   * @returns Observable of activity
   */
  getActivityById(id: string): Observable<ActivityResponse> {
    const url = `${this.baseUrl}activities/${id}`;
    
    return this.http.get<ActivityResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update activity by ID
   * @param id - Activity ID
   * @param updates - Partial activity data to update
   * @returns Observable of updated activity
   */
  updateActivity(id: string, updates: UpdateActivityRequest): Observable<ActivityResponse> {
    const url = `${this.baseUrl}activities/${id}`;
    
    // Convert Date objects to ISO strings for backend
    const payload: UpdateActivityRequest = { ...updates };

    if (updates.scheduledTime instanceof Date) {
      payload.scheduledTime = updates.scheduledTime.toISOString() as unknown as Date;
    }
    if (updates.lastCompleted instanceof Date) {
      payload.lastCompleted = updates.lastCompleted.toISOString() as unknown as Date;
    }

    return this.http.put<ActivityResponse>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update activity status
   * @param id - Activity ID
   * @param status - New status
   * @returns Observable of updated activity
   */
  updateActivityStatus(id: string, status: ActivityStatus): Observable<ActivityResponse> {
    const url = `${this.baseUrl}activities/${id}/status`;
    
    return this.http.patch<ActivityResponse>(url, { status }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mark activity as completed
   * @param id - Activity ID
   * @param completionDate - Optional completion date (defaults to now)
   * @returns Observable of updated activity
   */
  markActivityCompleted(id: string, completionDate?: Date): Observable<ActivityResponse> {
    const url = `${this.baseUrl}activities/${id}/complete`;
    
    const payload = {
      lastCompleted: completionDate ? completionDate.toISOString() : new Date().toISOString()
    };

    return this.http.patch<ActivityResponse>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete activity by ID
   * @param id - Activity ID
   * @returns Observable of deletion confirmation
   */
  deleteActivity(id: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}activities/${id}`;
    
    return this.http.delete<{ message: string }>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Bulk update activities status
   * @param activityIds - Array of activity IDs
   * @param status - New status for all activities
   * @returns Observable of bulk update response
   */
  bulkUpdateStatus(activityIds: string[], status: ActivityStatus): Observable<{ updated: number; message: string }> {
    const url = `${this.baseUrl}activities/bulk/status`;
    
    const payload = {
      activityIds,
      status
    };

    return this.http.patch<{ updated: number; message: string }>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get activities statistics
   * @param marketId - Optional market ID for market-specific stats
   * @returns Observable of activities statistics
   */
  getActivitiesStats(marketId?: string): Observable<{
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
    overdue: number;
    byFrequency: Record<ActivityFrequency, number>;
  }> {
    const url = marketId 
      ? `${this.baseUrl}markets/${marketId}/activities/stats`
      : `${this.baseUrl}activities/stats`;
    
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get upcoming activities
   * @param days - Number of days to look ahead (default: 7)
   * @param marketId - Optional market ID
   * @returns Observable of upcoming activities
   */
  getUpcomingActivities(days: number = 7, marketId?: string): Observable<ActivityResponse[]> {
    const url = marketId 
      ? `${this.baseUrl}markets/${marketId}/activities/upcoming`
      : `${this.baseUrl}activities/upcoming`;
    
    const params = new HttpParams().set('days', days.toString());
    
    return this.http.get<ActivityResponse[]>(url, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get overdue activities
   * @param marketId - Optional market ID
   * @returns Observable of overdue activities
   */
  getOverdueActivities(marketId?: string): Observable<ActivityResponse[]> {
    const url = marketId 
      ? `${this.baseUrl}markets/${marketId}/activities/overdue`
      : `${this.baseUrl}activities/overdue`;
    
    return this.http.get<ActivityResponse[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Convert backend response to Activity model
   * @param response - Backend response
   * @returns Activity model with proper Date objects
   */
  private mapResponseToActivity(response: ActivityResponse): Activity {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      scheduledTime: new Date(response.scheduledTime),
      frequency: response.frequency,
      status: response.status,
      lastCompleted: response.lastCompleted ? new Date(response.lastCompleted) : undefined
    };
  }

  /**
   * Convert multiple backend responses to Activity models
   * @param responses - Array of backend responses
   * @returns Array of Activity models
   */
  private mapResponsesToActivities(responses: ActivityResponse[]): Activity[] {
    return responses.map(response => this.mapResponseToActivity(response));
  }

  /**
   * Error handling for HTTP requests
   * @param error - HTTP error
   * @returns Observable that throws the error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 404) {
      errorMessage = 'Activity not found.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request data.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized access.';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden.';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error.';
    }

    console.error('ActivitiesService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
