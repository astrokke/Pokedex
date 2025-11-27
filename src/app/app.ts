import { Component, signal, inject } from '@angular/core';
import { PokemonListComponent } from './pokemon-list/pokemon-list';
import { SeoService } from './seo.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('ApiPoke');
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setInitialTags();
  }
}
