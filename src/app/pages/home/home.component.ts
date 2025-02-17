import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KatalogComponent } from "../katalog/katalog.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  
}
