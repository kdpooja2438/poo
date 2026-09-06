import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Room } from '../models/room.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly baseUrl = `${environment.apiBaseUrl}/rooms`;
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  private loadErrorSubject = new BehaviorSubject<string | null>(null);

  readonly rooms$ = this.roomsSubject.asObservable();
  readonly loadError$ = this.loadErrorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refresh();
  }

  private refresh(): void {
    this.http
      .get<Room[]>(this.baseUrl)
      .pipe(
        tap(() => this.loadErrorSubject.next(null)),
        catchError((err: HttpErrorResponse) => {
          this.loadErrorSubject.next(
            err.status === 0
              ? 'Cannot reach the server. Is the backend running on http://localhost:8081?'
              : 'Failed to load rooms from the server.'
          );
          return of<Room[]>([]);
        })
      )
      .subscribe((rooms) => this.roomsSubject.next(rooms));
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl);
  }

  addRoom(room: Omit<Room, 'id'>): Observable<Room> {
    return this.http.post<Room>(this.baseUrl, room).pipe(tap(() => this.refresh()));
  }

  updateRoom(id: number, room: Omit<Room, 'id'>): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/${id}`, room).pipe(tap(() => this.refresh()));
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(tap(() => this.refresh()));
  }
}
