import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {List} from './code-list.model';
import {Observable, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Code} from './code.model';
import {environment} from '../environments/environment';
import {FormGroup, NgForm} from '@angular/forms';

@Injectable()
export class SearchService {
  searchTerm = new Subject<string>();
  resultsChanged = new Subject<Code[]>();
  term: string;
  nextPageToken = 0;
  searchType = 'glyphicon glyphicon-sort-by-alphabet';
  searchField = 'description';
  isSearchDisabled = false;
  termFromLinkClicked = new Subject<string>();

  constructor(private http: HttpClient) {
    // this.search(this.searchTerm)
    //   .subscribe(response => {
    //     this.resultsChanged.next(response.results[' ']);
    //   },
    //     error => {
    //     console.log(error);
    //     const codes: Code[] = [];
    //     this.resultsChanged.next(codes);
    //     });

    this._search(this.searchTerm).subscribe(response => {
      this.resultsChanged.next(response.results[' ']);
    });
  }

  _search(terms: Observable<string>) {
    return terms.pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this._searchEntries(term)));
  }

  _searchEntries(term) {
    const list: List[] = [];
    this.nextPageToken = 0;
    if (term === undefined || term.trim().length === 0) {
      this.searchType = 'glyphicon glyphicon-sort-by-alphabet';
      return this.http.get<List>(environment.list,
        {params: {f: this.searchField, nextPageToken: (this.nextPageToken).toString()}})
        .pipe(catchError(error => list));
    } else {
      this.searchType = 'glyphicon glyphicon-search';
      return this.http.get<List>(environment.search,
        {params: {q: term, f: this.searchField}})
        .pipe(catchError(error => list));
    }
  }

  search(terms: Observable<string>) {
    return terms.pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
    this.nextPageToken = 0;
    if (term === undefined || term.trim().length === 0) {
      this.searchType = 'glyphicon glyphicon-sort-by-alphabet';
      return this.http.get<List>(environment.list,
        {params: {f: this.searchField, nextPageToken: (this.nextPageToken).toString()}});
    } else {
      this.searchType = 'glyphicon glyphicon-search';
      return this.http.get<List>(environment.search,
        {params: {q: term, f: this.searchField}});
    }
  }

  more() {
    this.nextPageToken += 15;
    if (this.term === undefined || this.term.trim().length === 0) {
      this.searchType = 'glyphicon glyphicon-sort-by-alphabet';
      return this.http.get<List>(environment.list,
        {params: {f: this.searchField, nextPageToken: (this.nextPageToken ).toString()}});
    } else {
      this.searchType = 'glyphicon glyphicon-search';
      return this.http.get<List>(environment.search,
        {params: {q: this.term, f: this.searchField, nextPageToken: (this.nextPageToken).toString()}});
    }
  }

  filter() {
    this.nextPageToken = 0;
    return this.searchEntries(this.term);
  }
}
