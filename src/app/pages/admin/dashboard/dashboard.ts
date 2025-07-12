import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MetaService } from '../../../core/services/meta/meta-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink,RouterLinkActive,RouterOutlet],
  standalone:true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard  {
  constructor(private metaService:MetaService) {}
   ngOnInit(): void {
  this.metaService.setMeta();
}
}
