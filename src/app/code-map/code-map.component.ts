import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../search.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Code} from '../code.model';
import {Observable, OperatorFunction, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {List} from '../code-list.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-code-map',
  templateUrl: './code-map.component.html',
  styleUrls: ['./code-map.component.css']
})
export class CodeMapComponent implements OnInit {
  @Input()
  icd10: string;
  @Input()
  adesc: string;
  @Input()
  type: string;
  code: string;
  desc: string;
  error = {
    status: false,
    message: ''
  };
  term = new Subject<string>();
  form: FormGroup;
  @Input()
  newCodeAdded: Subject<Code>;

  constructor(private route: ActivatedRoute,
              private http: HttpClient) {
    this._search(this.term).subscribe(found => {
      if (!found) {
        this.error.status = true;
        this.error.message = 'Code Alreay Exists!';
      } else if (found === '.') {
        this.error.status = true;
        this.error.message = 'Oops! something went wrong';
      } else {
        this.error.status = false;
        this.error.message = '';
      }
    }, error => {
      this.error = error;
    });
  }

  // ngOnInit() {
  //   this.search.isSearchDisabled = true;
  //   this.route.params.subscribe((params) => {
  //     this.code = params['code'];
  //     this.search.term = this.code;
  //   });
  //   this.route.queryParams.subscribe((params) => {
  //     this.type = params['t'];
  //     this.desc = params['d'];
  //     this.search.searchField = params['f'];
  //     this.search.searchType = 'glyphicon glyphicon-search';
  //   });
  // }

  ngOnInit() {
    this.error.status = false;
    this.error.message = '';
    this.form = new FormGroup({
      'code': new FormControl('', [Validators.required]),
      'desc': new FormControl('')
    });
  }

  onSubmit() {
    const code = new Code(this.form.get('code').value, this.form.get('desc').value,
      this.icd10, this.type, this.adesc);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.map, code, {headers: headers}).subscribe((response) => {
      this.error.status = false;
      this.error.message = 'Successfully added';
      this.form.setValue({
        code: '',
        desc: ''
      });
      this.newCodeAdded.next(code);
    }, error => {
      this.error.status = true;
      this.error.message = 'Oops! something went wrong';
    });
    // this.search.map(code).subscribe((response) => {
    //   console.log(response);
    //   this.error = '';
    // },
    //   error => {
    //   console.log(error);
    //     this.error = error;
    //   });
  }

  _search(terms: Observable<string>) {
    return terms.pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this._searchEntries(term)));
  }

  _searchEntries(term) {
    return this.http.get<Code>(environment.unique_code, {observe: 'response',
    params: {
      'code': term
    }})
      .pipe(
        map((data) => {
          // console.log('data', data)
          if (null !== data.body) {
            return false;
          }
          return true;
        })
        , catchError(error => '.')
      );
  }

  onKeyup(value: string) {
    // console.log(value);
    this.term.next(value);
  }

  onFocus(value: string) {
    this.term.next(value);
  }
}
