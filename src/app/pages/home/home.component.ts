import { ChangeDetectorRef, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { KatalogComponent } from "../katalog/katalog.component";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, retry, timeout } from 'rxjs';


interface Imagess {
  urlGambar: string;
  altGambar: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  isLoading = true;
  error: string | null = null;
  maxRetries = 3;
  retryCount = 0;

  images: Imagess[] = [];
  currentIndex = 0;
  slideOffset = 0;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    // Hanya fetch data jika di browser
    
    if (isPlatformBrowser(this.platformId)) {
      this.fetchProducts();
    }
  }

  private fetchProducts(): void {
    this.isLoading = true;
    this.error = null;

      const apiUrlImg =
      'https://script.google.com/macros/s/AKfycbzmuNSMfpWKCcxNAi3PNDaXl3x4bjzA_yr--dTYafefIgZc0SXEu04Grb9NA-mrfxty/exec';
    this.http.get<Imagess[]>(apiUrlImg)
      .pipe(
        timeout(5000),
        retry(this.maxRetries),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            this.images = data;
          } else {
            this.images = [
              {
                urlGambar: 'https://placehold.co/800x400?text=No+Image',
                altGambar: 'images'
              },
            ];
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching images:', error);
          this.images = [
            {
              urlGambar: 'https://placehold.co/800x400?text=No+Image',
              altGambar: 'images'
            },
          ];
          this.cdr.detectChanges();
          this.startAutoSlide();
        },
      });
  }
  autoSlideInterval: any;

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 5000); // Ganti slide setiap 3 detik
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
  nextImage() {
    if (this.images.length === 0) return; // Cegah error jika array kosong
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSlideOffset();
  }
  
  prevImage() {
    if (this.images.length === 0) return; // Cegah error jika array kosong
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSlideOffset();
  }
  

  updateSlideOffset() {
    // Set the offset based on the current index
    this.slideOffset = -this.currentIndex * 100;
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Terjadi kesalahan saat memuat data.';
    
    if (error.status === 404) {
      errorMessage = 'Data tidak ditemukan.';
    } else if (error.status === 0) {
      errorMessage = 'Tidak dapat terhubung ke server.';
    }
  
    console.error('Error fetching data:', error);
    this.error = errorMessage;
    
    // Gunakan fallback data
    return of("error");
  }

  // Tambahkan fungsi untuk retry manual
  retryFetch(): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.fetchProducts();
    }
  }
}
