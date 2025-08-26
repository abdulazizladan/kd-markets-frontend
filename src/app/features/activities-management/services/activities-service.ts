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
  scheduledTime: number; // Epoch timestamp
  frequency: ActivityFrequency;
  status?: ActivityStatus;
  lastCompleted?: number; // Epoch timestamp
}

export interface UpdateActivityRequest {
  name?: string;
  description?: string;
  scheduledTime?: number; // Epoch timestamp
  frequency?: ActivityFrequency;
  status?: ActivityStatus;
  lastCompleted?: number; // Epoch timestamp
}

export interface ActivitiesQueryParams {
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  
  private readonly baseUrl = env.baseUrl;
  private readonly http = inject(HttpClient);

  /**
   * Get all activities with optional keyword search
   * @param params - Query parameters for search
   * @returns Observable of activities array
   */
  getAllActivities(params?: ActivitiesQueryParams): Observable<Activity[]> {
    const url = `${this.baseUrl}activities`;
    console.log('Service: getAllActivities called with URL:', url);
    console.log('Service: Base URL:', this.baseUrl);
    console.log('Service: Params:', params);
    
    let httpParams = new HttpParams();
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }

    console.log('Service: Final HTTP params:', httpParams);
    console.log('Service: Making HTTP GET request to:', url);

    return this.http.get<any[]>(url, { params: httpParams }).pipe(
      map(response => response.map(item => this.mapResponseToActivity(item))),
      catchError(error => {
        console.error('Service: HTTP error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get activity by ID
   * @param id - Activity ID
   * @returns Observable of activity
   */
  getActivityById(id: string): Observable<Activity> {
    const url = `${this.baseUrl}activities/${id}`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.mapResponseToActivity(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new activity
   * @param activity - Activity data to create
   * @returns Observable of created activity
   */
  createActivity(activity: CreateActivityRequest): Observable<Activity> {
    const url = `${this.baseUrl}activities`;
    
    // Convert Date objects to ISO strings for backend
    const payload = {
      ...activity,
      scheduledTime: activity.scheduledTime,
      lastCompleted: 121212
    };

    return this.http.post<any>(url, payload).pipe(
      map(response => this.mapResponseToActivity(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update activity by ID
   * @param id - Activity ID
   * @param updates - Partial activity data to update
   * @returns Observable of updated activity
   */
  updateActivity(id: string, updates: UpdateActivityRequest): Observable<Activity> {
    const url = `${this.baseUrl}activities/${id}`;
    
    // Convert Date objects to ISO strings for backend
    const payload: any = { ...updates };

    if (updates.scheduledTime) {
      payload.scheduledTime = updates.scheduledTime;
    }
    if (updates.lastCompleted) {
      payload.lastCompleted = updates.lastCompleted;
    }

    return this.http.put<any>(url, payload).pipe(
      map(response => this.mapResponseToActivity(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update activity status
   * @param id - Activity ID
   * @param status - New status
   * @returns Observable of updated activity
   */
  updateActivityStatus(id: string, status: ActivityStatus): Observable<Activity> {
    const url = `${this.baseUrl}activities/${id}/status`;
    
    return this.http.patch<any>(url, { status }).pipe(
      map(response => this.mapResponseToActivity(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Mark activity as completed
   * @param id - Activity ID
   * @param completionDate - Optional completion date (defaults to now)
   * @returns Observable of updated activity
   */
  markActivityCompleted(id: string, completionDate?: Date): Observable<Activity> {
    const url = `${this.baseUrl}activities/${id}/complete`;
    
    const payload = {
      lastCompleted: completionDate ? completionDate.getTime() : Date.now()
    };

    return this.http.patch<any>(url, payload).pipe(
      map(response => this.mapResponseToActivity(response)),
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

  /**
   * Maps a backend response item to an Activity model.
   * @param item - The backend response item.
   * @returns The mapped Activity model.
   */
  private mapResponseToActivity(item: any): Activity {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      scheduledTime: new Date(item.scheduledTime),
      frequency: item.frequency,
      status: item.status,
      lastCompleted: item.lastCompleted ? new Date(item.lastCompleted) : undefined,
      createdAt: item.createdAt
    };
  }
}
