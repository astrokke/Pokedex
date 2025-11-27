import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PokemonService } from '../../Service/PokemonService';
import { SeoService } from '../seo.service';
import { PokemonListComponent } from './pokemon-list';

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

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [
        { provide: PokemonService, useClass: PokemonServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
