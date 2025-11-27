import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PokemonService } from '../Service/PokemonService';
import { SeoService } from './seo.service';
import { App } from './app';

class PokemonServiceStub {
  pokemonsList = signal([]);
  isLoadingState = signal(false);
  nextUrlState = signal(null);
  typesList = signal([]);

  getPokemons() {
    return of([]);
  }

  loadMore() {
    return of([]);
  }

  loadTypes() {
    return of([]);
  }

  filterByType() {
    return of([]);
  }
}

class SeoServiceStub {
  setInitialTags() {}
  updateListContext() {}
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: PokemonService, useClass: PokemonServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the pokemon list heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Pokémon disponibles');
  });
});
