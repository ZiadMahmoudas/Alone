import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {

}
