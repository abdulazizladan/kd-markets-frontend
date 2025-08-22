import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  private authStore = inject(AuthStore)
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];

    if (this.authStore.userRole() === requiredRole) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
