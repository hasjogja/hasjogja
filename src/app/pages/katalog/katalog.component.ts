import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  status: string;
  images: string[];
}

@Component({
  selector: 'app-katalog',
  imports: [CommonModule,FormsModule],
  templateUrl: './katalog.component.html',
  styleUrls: ['./katalog.component.css']
})
export class KatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen: boolean = false;
  selectedImage: string = '';
  itemsPerPage: number = 12;
  currentPage: number = 1;
  searchQuery: string = '';
  selectedFilter: string = 'default';
  hargaAscending: boolean = true;
  Math = Math;

  private apiUrl = 'https://script.google.com/macros/s/AKfycbxcxUZIU3yIs1f2FMhlBysejEW6xjTX72j8LyzByxQw4vlL19SfNw6WRxTZZ71b_dGN/exec';

  constructor(private http: HttpClient) {}

  isLoading: boolean = true;
isError: boolean = false;

ngOnInit(): void {
  this.loadProducts();

  // Jika lebih dari 15 detik, tampilkan pesan error
  setTimeout(() => {
    if (this.isLoading) {
      this.isError = true;
      this.isLoading = false;
    }
  }, 15000);
}

loadProducts(): void {
  this.http.get<any[]>(this.apiUrl).subscribe((data) => {
    this.products = data.map(item => ({
      id: item.id,
      name: item.namaProduk,
      material: item.material,
      size: item.ukuran,
      colors: item.warna,
      basePrice: item.hargaDasar,
      price100: item.harga100_399,
      price400: item.harga400_699,
      price700: item.harga700_999,
      price1000: item.harga1000Plus,
      packaging: item.kemasan,
      addOns: item.addOns,
      priceLabel: item.hargaLabel,
      pricePrinting: item.hargaPrinting,
      priceThanksCard: item.hargaThanksCard,
      notes: item.catatan,
      status: item.status,
      images: [item.urlGambar1, item.urlGambar2, item.urlGambar3].filter(img => img)
    }));
    
    this.filteredProducts = [...this.products];
    this.updateDisplayedProducts();
    
    this.isLoading = false;
  }, error => {
    this.isError = true;
    this.isLoading = false;
  });
}

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'harga') {
      this.hargaAscending = !this.hargaAscending;
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => product.name.toLowerCase().includes(query));
    }
    if (this.selectedFilter === 'terbaru') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (this.selectedFilter === 'terlaris') {
      filtered = filtered.filter(product => product.status.toLowerCase() === 'terlaris');
    } else if (this.selectedFilter === 'harga') {
      filtered.sort((a, b) => this.hargaAscending ? a.basePrice - b.basePrice : b.basePrice - a.basePrice);
    }
    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedProducts();
  }

  getPaginationRange(): number[] {
    const totalPages = this.totalPages;
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let start = Math.max(1, this.currentPage - halfRange);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.selectedImage = product.images[0];
    this.isModalOpen = true;
    document.body.classList.add("overflow-hidden");
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
    document.body.classList.remove("overflow-hidden");
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  encodeText(text: string | undefined): string {
    return encodeURIComponent(text ?? "Produk");
  }
}
