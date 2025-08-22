import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { UsersService } from '../services/users-service';
import { User } from '../models/user.model';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  search: string;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  search: ''
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    users: computed(() => state.users()),
    isLoading: computed(() => state.isLoading()),
    error: computed(() => state.error()),
    search: computed(() => state.search()),
    filteredUsers: computed(() => {
      const term = state.search().trim().toLowerCase();
      if (!term) return state.users();
      return state.users().filter(u =>
        String(u.id).includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.status.toLowerCase().includes(term) ||
        u.info?.firstName?.toLowerCase().includes(term) ||
        u.info?.lastName?.toLowerCase().includes(term) ||
        u.contact?.phone?.toLowerCase().includes(term)
      );
    })
  })),
  withMethods((store, usersService = inject(UsersService)) => ({
    async loadUsers() {
      patchState(store, { isLoading: true, error: null });
      try {
        const data = await usersService.findAll();
        patchState(store, { users: data, isLoading: false });
      } catch (error: any) {
        patchState(store, { isLoading: false, error: error?.message ?? 'Failed to load users' });
      }
    },
    addUser(newUser: User) {
      const current = store.users();
      patchState(store, { users: [newUser, ...current] });
    },
    setSearch(value: string) {
      patchState(store, { search: value });
    },
    clearError() {
      patchState(store, { error: null });
    }
  }))
);
