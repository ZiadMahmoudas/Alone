import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
   constructor(public auth:Auth){}
}
