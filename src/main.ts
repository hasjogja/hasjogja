import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // 🔥 Import ini

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // 🔥 Tambahkan ini agar HttpClient tersedia di seluruh aplikasi
  ]
})
.catch(err => console.error(err));
