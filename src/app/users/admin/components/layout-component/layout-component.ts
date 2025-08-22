import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-layout-component',
  standalone: false,
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss'
})
export class LayoutComponent implements OnInit{

  public authStore = inject(AuthStore);

  public logout() {
    this.authStore.logout()
  }

  ngOnInit() {}

}
