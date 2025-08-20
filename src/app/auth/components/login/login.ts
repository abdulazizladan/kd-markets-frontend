import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(Auth);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  message: string | null = null;
  isError: boolean = false;

  async submit() {
    this.message = null; // Clear previous messages
    this.isError = false;

    // Check if the form is valid before proceeding
    if (this.loginForm.invalid) {
      this.isError = true;
      this.message = 'Please correct the errors in the form.';
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      // Attempt to sign in with email and password
      //await signInWithEmailAndPassword(this.authService, email, password);
      this.message = 'Login successful!';
      // In a real application, you would navigate to a new page here.
      // E.g., this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.isError = true;
      console.error('Login failed:', error);
      // Display a user-friendly error message based on the Firebase error code
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          this.message = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          this.message = 'The email address is not in a valid format.';
          break;
        case 'auth/user-disabled':
          this.message = 'This user account has been disabled.';
          break;
        default:
          this.message = 'An unknown error occurred. Please try again.';
      }
    }
  }
}
