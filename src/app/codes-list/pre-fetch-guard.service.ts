import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {List} from '../code-list.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SearchService} from '../search.service';

@Injectable()
export class PreFetchGuard implements Resolve<List> {

  constructor(private http: HttpClient,
              private search: SearchService) {}

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<List> | Promise<List> | List {
      return this.search.searchEntries(this.search.term);
  }
}
