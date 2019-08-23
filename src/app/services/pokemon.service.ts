import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { PokemonJSON } from '../http-client/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http: HttpClient,
  ) { }

  getPokemonList(): Observable<HttpResponse<PokemonJSON[]>> {
    const url = 'https://raw.githubusercontent.com/naoyamaguchi/pokemon.json/master/pokedex.json';
    return this.http.get<PokemonJSON[]>(url, { observe: 'response' })
    .pipe(
      timeout(2500),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error.error);
  }
}
