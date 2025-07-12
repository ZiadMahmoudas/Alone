import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DashboardService } from '../../../../core/services/DashboardServices/dashboard.service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
 users: any = [];
  previousUserCount = 0;
  audio = new Audio();
  pollingSubscription: Subscription | undefined;

  constructor(
    private dashboardServices: DashboardService,
    private toastr: ToastrService
  ) {
    this.audio.src = 'audio/rang.mp3';
    this.audio.load();
  }
deleteUser(id: number) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "لن تتمكن من التراجع عن هذا!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء',
  }).then((result) => {
    if (result.isConfirmed) {
      this.dashboardServices.deleteUser(id).subscribe({
        next: (res) => {
          console.log('Res:', res);
          this.users = this.users.filter((user: any) => user.id !== id);
          this.toastr.success("Delete Successfully");
        },
        error: (err) => {
          console.log(err.status);
          this.toastr.error("Error something Wrong");
        }
      });
    }
  });
}

  ngOnInit(): void {
    this.pollingSubscription = interval(10000).subscribe(() => {
      this.checkForNewUsers();
    });

    this.checkForNewUsers();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  checkForNewUsers() {
    this.dashboardServices.getAllUsers().subscribe({
      next: (res: any) => {
        const newUsers = res.users;
        if (newUsers.length > this.previousUserCount) {
          this.playNotificationSound();
        }

        this.users = newUsers;
        this.previousUserCount = newUsers.length;
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastr.error("Don't Play Here Again 😈");
        }
      }
    });
  }

  playNotificationSound() {
    this.audio.play().catch(() => {
    });
  }
}
