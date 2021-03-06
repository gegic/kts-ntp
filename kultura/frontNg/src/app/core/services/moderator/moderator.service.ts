import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Moderator} from '../../models/moderator';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  moderators: any[] = [];

  constructor(private httpClient: HttpClient) {
  }

  public getModerators(page: number): Observable<any> {
    return this.httpClient.get(`/api/users/moderators?page=${page}`);
  }

  public getModeratorById(id: number): Observable<Moderator> {
    return this.httpClient.get('/api/users/' + id);
  }

  public createModerator(moderator: Moderator): Observable<any> {
    return this.httpClient.post('/api/users/moderator', moderator);
  }

  public updateModerator(moderator: Moderator): Observable<any> {
    return this.httpClient.put('/api/users', moderator);
  }

  delete(id: string | number): Observable<any> {
    return this.httpClient.delete(`/api/users/${id}`);
  }
}
