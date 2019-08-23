import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { PokemonService } from '../services/pokemon.service';
import { PokemonJSON } from './pokemon';

@Component({
  selector: 'app-http-client',
  templateUrl: './http-client.component.html',
  styleUrls: ['./http-client.component.scss']
})
export class HttpClientComponent implements OnInit {
  pokemonJSON: PokemonJSON[];

  constructor(
    private pokemonService: PokemonService,
  ) { }

  ngOnInit() {
    this.pokemonService.getPokemonList().subscribe(
      (value: HttpResponse<PokemonJSON[]>) => {
        console.log(value.body);
        this.pokemonJSON = value.body;
      }, (error) => {
        console.log(error);
      }
    );
  }

  toTripleDigit(n: number): string {
    let nString = String(n);
    if (nString.length === 1) {
      nString = '00' + nString;
    } else if (nString.length === 2) {
      nString = '0' + nString;
    }
    return nString;
  }

}
