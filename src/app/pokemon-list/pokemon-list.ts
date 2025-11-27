import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { PokemonService } from '../../Service/PokemonService';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly seo = inject(SeoService);

  protected readonly pokemons = this.pokemonService.pokemonsList;
  protected readonly isLoading = this.pokemonService.isLoadingState;
  protected readonly nextUrl = this.pokemonService.nextUrlState;
  protected readonly types = this.pokemonService.typesList;
  protected readonly selectedType = signal('');

  constructor() {
    effect(() => {
      const list = this.pokemons();
      const currentType = this.selectedType();
      this.seo.updateListContext(currentType, list);
    });
  }

  ngOnInit(): void {
    this.pokemonService.loadTypes().subscribe();
    if (this.pokemons().length === 0) {
      this.pokemonService.getPokemons().subscribe();
    }
  }

  protected spriteUrl(pokemon: { name: string; url: string }): string {
    const segments = pokemon.url.split('/').filter(Boolean);
    const id = segments[segments.length - 1];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  protected loadMore(): void {
    this.pokemonService.loadMore().subscribe();
  }

  protected onTypeChange(type: string): void {
    this.selectedType.set(type);
    this.pokemonService.filterByType(type || null).subscribe();
  }
}
