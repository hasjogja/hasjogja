import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  material: string;
  size: string;
  colors: number;
  basePrice: number;
  price100: number;
  price400: number;
  price700: number;
  price1000: number;
  packaging: string;
  addOns: string;
  priceLabel: number;
  pricePrinting: number;
  priceThanksCard: number;
  notes: string;
  images: string[];
}

@Component({
  selector: 'app-katalog',
  templateUrl: './katalog.component.html',
  styleUrls: ['./katalog.component.css']
})
export class KatalogComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen: boolean = false;
  page: number = 1;
  limit: number = 12;
  isLoading: boolean = false;
  allLoaded: boolean = false;
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxWE3s_JCD2besdx0fHrV9f-b_xN2DQ0Q419d3ju3st1pldqUc335gK984aauP0b_CC/exec';
  selectedImage: string = ''; // Default gambar yang dipilih

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.isLoading || this.allLoaded) return;

    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}?page=${this.page}&limit=${this.limit}`).subscribe((data) => {
      if (data.length === 0) {
        this.allLoaded = true;
      } else {
        const mappedData: Product[] = data.map(item => ({
          id: item.ID,
          name: item["Nama Produk"],
          material: item.Material,
          size: item.Ukuran,
          colors: item.Warna,
          basePrice: item["Harga Dasar"],
          price100: item["Harga 100-399"],
          price400: item["Harga 400-699"],
          price700: item["Harga 700-999"],
          price1000: item["Harga 1000+"],
          packaging: item.Kemasan,
          addOns: item["Add-ons"],
          priceLabel: item["Harga Label"],
          pricePrinting: item["Harga Printing"],
          priceThanksCard: item["Harga Thanks Card"],
          notes: item.Catatan,
          images: [item["Url Gambar1"], item["Url Gambar 2"], item["Url Gambar 3 "]].filter(img => img)
        }));

        this.products = [...this.products, ...mappedData];
        this.page++;
      }
      this.isLoading = false;
    });
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.selectedImage = product.images[0];
    this.isModalOpen = true;
    document.body.classList.add("overflow-hidden"); // Mencegah scroll pada halaman utama
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
    document.body.classList.remove("overflow-hidden"); // Mengembalikan scroll
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  encodeText(text: string | undefined): string {
    return encodeURIComponent(text ?? "Produk");
  }
  
  
}
