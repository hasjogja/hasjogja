import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KatalogComponent } from "../katalog/katalog.component";
import { HttpClient } from '@angular/common/http';
interface Image {
  imageUrl: string;
  imageAlt: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images: Image[] = []; // Menggunakan interface

  currentIndex: number = 0;
  autoSlideInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchImages();
  }

  fetchImages() {
    const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=xXN5lPqQR6NUJO9wnuwtvwtpiNBa9Tt7nnxhuwW-HkphgNjH4HM4Q0CGPFRfcNfkY7OFnHYePqb3erVKb5eE1EBzP6CRvieFOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa_brE9iU_qx0G-QYZrMkjuGj6ywnbqNPFNdDsjCwPlJdiAbZ8OQu-bwn6LzSSo-z3-Ykimv_WXavdsUEufMaR1X1fGrswVXvvReXFGjfn0lBV-OKc9x2LozfaAq_wLT_Dg&lib=MKWxX95yp2Q6oeJmWhR_qczTawgCSwanj';

    this.http.get<Image[]>(apiUrl).subscribe(
      (response) => {
        console.log("API Response:", response);
        this.images = response || [];
        if (!this.images.length) {
          console.error("API returned empty image list!");
        }
      },
      (error) => console.error("Error fetching images:", error)
    );
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }
}
