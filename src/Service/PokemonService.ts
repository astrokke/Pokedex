import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, finalize, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly pokemons = signal<{ name: string; url: string }[]>([]);
  readonly url = 'https://pokeapi.co/api/v2/pokemon?limit=20';
  private readonly nextUrl = signal<string | null>(this.url);
  private readonly loading = signal(false);
  private readonly types = signal<string[]>([]);
  private readonly typeEndpoint = 'https://pokeapi.co/api/v2/type';

  getPokemons(url?: string): Observable<any> {
    const targetUrl = url || this.url;
    this.loading.set(true);
    return this.http.get<any>(targetUrl).pipe(
      tap((response) => {
        const nouveaux = response?.results ?? [];
        this.pokemons.update((prev) => [...prev, ...nouveaux]);
        this.nextUrl.set(response?.next ?? null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  loadTypes(): Observable<any> {
    if (this.types().length > 0) {
      return EMPTY;
    }

    this.loading.set(true);
    return this.http.get<any>(this.typeEndpoint).pipe(
      tap((response) => {
        const typeNames = (response?.results ?? []).map((type: { name: string }) => type.name);
        this.types.set(typeNames);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  filterByType(typeName: string | null): Observable<any> {
    if (!typeName) {
      this.resetData();
      return this.getPokemons();
    }

    this.loading.set(true);
    return this.http.get<any>(`${this.typeEndpoint}/${typeName}`).pipe(
      tap((response) => {
        const filtered = (response?.pokemon ?? []).map(
          (entry: { pokemon: { name: string; url: string } }) => entry.pokemon
        );
        this.pokemons.set(filtered);
        this.nextUrl.set(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  loadMore(): Observable<any> {
    const next = this.nextUrl();
    if (!next) {
      return EMPTY;
    }
    return this.getPokemons(next);
  }

  get pokemonsList() {
    return this.pokemons.asReadonly();
  }

  get nextUrlState() {
    return this.nextUrl.asReadonly();
  }

  get isLoadingState() {
    return this.loading.asReadonly();
  }

  get typesList() {
    return this.types.asReadonly();
  }

  private resetData(): void {
    this.pokemons.set([]);
    this.nextUrl.set(this.url);
  }

}


