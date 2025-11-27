import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly defaultImage =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
  private readonly canonicalHost = 'https://api-poke.example.com';

  setInitialTags(): void {
    this.updateTags({
      title: 'ApiPoke • Liste des Pokémon en temps réel',
      description:
        'Consultez les Pokémon de la PokéAPI, filtrez par type et chargez plus de résultats en un clic.',
      keywords: 'pokémon,pokedex,type feu,type eau,type plante,api poke',
      url: this.canonicalHost,
    });
    this.updateCanonical(this.canonicalHost);
  }

  updateListContext(type: string, list: { name: string; url: string }[]): void {
    const readableType = type ? `de type ${type}` : 'tous types';
    const seoUrl = `${this.canonicalHost}${type ? `/type/${type}` : '/'}`;
    const description = `Explorez ${list.length} Pokémon ${readableType} mis à jour en direct grâce à ApiPoke.`;

    this.updateTags({
      title: `Pokémon ${readableType} | ApiPoke`,
      description,
      url: seoUrl,
      type: 'website',
    });
    this.updateCanonical(seoUrl);
    this.updateJsonLd(list, readableType);
  }

  private updateTags(config: SeoConfig): void {
    const title = config.title ?? 'ApiPoke';
    const description =
      config.description ??
      'Découvrez les Pokémon les plus populaires et filtrez-les par type grâce à ApiPoke.';
    const keywords = config.keywords ?? 'pokemon,pokedex,type feu,type eau,type plante';
    const url = config.url ?? this.canonicalHost;
    const image = config.image ?? this.defaultImage;
    const type = config.type ?? 'website';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateJsonLd(list: { name: string; url: string }[], readableType: string): void {
    const scriptId = 'seo-itemlist';
    let script = this.document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    const itemList = list.slice(0, 20).map((pokemon, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: pokemon.name,
      url: pokemon.url,
    }));

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Liste des Pokémon ${readableType}`,
      itemListElement: itemList,
    });
  }
}

