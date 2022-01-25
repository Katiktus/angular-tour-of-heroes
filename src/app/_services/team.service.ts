import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from '../_models/hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class TeamService {}