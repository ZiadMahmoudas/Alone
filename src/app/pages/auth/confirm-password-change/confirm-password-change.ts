import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth/auth'; // تأكد من المسار الصحيح

@Component({
  selector: 'app-confirm-password-change',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-container">
      @if (loading) {
        <p>Processing your request...</p>
      } @else {
        <p [class.success]="isSuccess" [class.error]="isError">{{ message }}</p>
        @if (message && (isSuccess || isError || message.includes('cancelled'))) {
          <button (click)="goToLogin()" class="go-to-login-button">Go to Login</button>
        }
      }
    </div>
  `,
  styles: [`
    .confirmation-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 20px;
      text-align: center;
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f7fafc;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
      max-width: 500px;
    }
    p {
      font-size: 1.1em;
      margin-bottom: 20px;
      padding: 10px;
      border-radius: 8px;
      width: 90%;
      box-sizing: border-box;
    }
    .success {
      color: #155724;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
    }
    .error {
      color: #721c24;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
    }
    .go-to-login-button {
      background-color: #4c82af;
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s ease, transform 0.2s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }
    .go-to-login-button:hover {
      background-color: #3b6b93;
      transform: translateY(-2px);
    }
    .go-to-login-button:active {
      transform: translateY(0);
    }
  `]
})
export class ConfirmPasswordChangeComponent implements OnInit {
  loading: boolean = true;
  message: string | null = null;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: Auth
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const action = params['action'] || 'confirmed';

      if (!token) {
        this.message = 'Invalid or missing confirmation token.';
        this.isError = true;
        this.loading = false;
        return;
      }

      this.authService.confirmPasswordChange(token, action).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.message = response.message;
          if (response.status === 'success') {
            this.isSuccess = true;
          } else if (response.status === 'cancelled') {
            this.isSuccess = false;
            this.isError = false;

          } else {
            this.isError = true;
            this.isSuccess = false;
          }

        },
        error: (err: any) => {
          this.loading = false;
          this.isError = true;
          this.isSuccess = false;
          console.error('Error confirming password change:', err);
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else if (err.status === 400) {
            this.message = 'Confirmation token invalid or expired. Please request a new one.';
          } else if (err.status === 404) {
            this.message = 'User or token not found for confirmation.';
          }
          else {
            this.message = 'An error occurred during password confirmation.';
          }
        }
      });
    });
  }

  goToLogin(): void {
    let queryParams: { [key: string]: string } = {};
    if (this.isSuccess) {
      queryParams['passwordReset'] = 'success';
    } else if (this.message && this.message.includes('cancelled')) {
      queryParams['passwordReset'] = 'cancelled';
    } else {
      queryParams['passwordReset'] = 'errorExpire';
    }
    this.router.navigate(['/login'], { queryParams: queryParams });
  }
}
