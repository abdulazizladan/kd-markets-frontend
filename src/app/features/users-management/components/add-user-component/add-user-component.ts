import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/users-service';
import { UsersStore } from '../../store/users.store';

@Component({
  selector: 'app-add-user-component',
  standalone: false,
  templateUrl: './add-user-component.html',
  styleUrl: './add-user-component.scss'
})
export class AddUserComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly usersStore = inject(UsersStore);
  private readonly dialogRef = inject(MatDialogRef<AddUserComponent>);

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    status: ['', Validators.required],
    phone: [''],
    image: [''],
  });

  async onSubmit() {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { firstName, lastName, email, role, status, phone, image } = this.form.value;

    // Prepare payload based on User, Info, and Contact models
    const payload = {
      email,
      role,
      status,
      info: {
        firstName,
        lastName,
        image,
      },
      contact: {
        phone,
      },
    } as any; // Allow backend to generate id/createdAt

    try {
      await this.usersService.createUser(payload);
      await this.usersStore.loadUsers();
      this.dialogRef.close(true);
    } catch (e) {
      // Keep dialog open; in a real app you might show a toast/snackbar
      console.error('Failed to create user', e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
