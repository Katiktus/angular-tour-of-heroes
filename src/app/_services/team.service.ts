import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Team } from '../_models/team';
import { Hero } from '../_models/hero';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private teamsUrl = 'api/teams';
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsUrl)
      .pipe(
        tap(_ => this.log('fetched teams')),
        catchError(this.handleError<Team[]>('getTeam', []))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  getTeamNo404<Data>(id: number): Observable<Team> {
    const url = `${this.teamsUrl}/?id=${id}`;
    return this.http.get<Team[]>(url)
      .pipe(
        map(teams => teams[0]),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} team id=${id}`);
        }),
        catchError(this.handleError<Team>(`getTeam id=${id}`))
      );
  }

  getTeam(id: number): Observable<Team> {
    const url = `${this.teamsUrl}/${id}`;
    return this.http.get<Team>(url).pipe(
      tap(_ => this.log(`fetched team id=${id}`)),
      catchError(this.handleError<Team>(`getTeam id=${id}`))
    );
  }

  searchTeams(term: string): Observable<Team[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Team[]>(`${this.teamsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found team matching "${term}"`) :
         this.log(`no team0 matching "${term}"`)),
      catchError(this.handleError<Team[]>('searchHeroes', []))
    );
  }

  addTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(this.teamsUrl, team, this.httpOptions).pipe(
      tap((newTeam: Team) => this.log(`added team w/ id=${newTeam.id}`)),
      catchError(this.handleError<Team>('addTeam'))
    );
  }

  deleteTeam(id: number): Observable<Team> {
    const url = `${this.teamsUrl}/${id}`;

    return this.http.delete<Team>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted team id=${id}`)),
      catchError(this.handleError<Team>('deleteTeam'))
    );
  }

  updateTeam(team: Team): Observable<any> {
    return this.http.put(this.teamsUrl, team, this.httpOptions).pipe(
      tap(_ => this.log(`updated team id=${team.id}`)),
      catchError(this.handleError<any>('updateTeam'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`TeamService: ${message}`);
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}