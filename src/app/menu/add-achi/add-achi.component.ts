import {Component, HostBinding, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Code} from '../../code.model';
import {Observable, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-add-achi',
  templateUrl: './add-achi.component.html',
  styleUrls: ['./add-achi.component.css']
})
export class AddAchiComponent implements OnInit {
  form: FormGroup;
  codes: Code[] = [];
  addCodeNeedToShow: boolean;
  term = new Subject<string>();
  cterm = new Subject<string>();
  error = {
    status: false,
    message: ''
  };
  cerror = {
    status: false,
    message: ''
  };

  constructor(private http: HttpClient) {
    this._search(this.term).subscribe(found => {
      // console.log('unique->next->', found);
      // console.log('form->achi->valid', this.form.get('achi').valid);
      // console.log('error->status', this.error.status);
      // console.log('addCode->needToShow', this.addCodeNeedToShow);
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

    this._csearch(this.cterm).subscribe(found => {
      // console.log('unique->next->', found);
      // console.log('form->achi->valid', this.form.get('achi').valid);
      // console.log('error->status', this.error.status);
      // console.log('addCode->needToShow', this.addCodeNeedToShow);
      if (!found) {
        this.cerror.status = true;
        this.cerror.message = 'Code Alreay Exists!';
      } else if (found === '.') {
        this.cerror.status = true;
        this.cerror.message = 'Oops! something went wrong';
      } else {
        this.cerror.status = false;
        this.cerror.message = '';
      }
    }, error => {
      this.cerror = error;
    });
  }

  ngOnInit() {
    this.addCodeNeedToShow = true;
    this.form = new FormGroup({
      achi: new FormGroup({
        code: new FormControl(''),
        desc: new FormControl('')
      }),
    hospital: new FormGroup({
      code: new FormControl(''),
      desc: new FormControl('')
    })});
  }

  onAddCode() {
    if (!(this.codes.find((code) => {
      if (this.form.get('hospital').get('code').value === code.code) {
        return true;
      }
    }))) {
      this.codes.push(
        new Code(this.form.get('hospital').get('code').value, this.form.get('hospital').get('desc').value,
          this.form.get('achi').get('code').value, 'add', this.form.get('achi').get('desc').value));
      this.form.get('hospital').setValue({
        code: '',
        desc: ''
      });
      this.addCodeNeedToShow = false;
      this.form.get('achi').disable();
    }
  }

  onAddMore() {
    this.addCodeNeedToShow = true;
  }

  onFocusDesc() {
    this.form.get('hospital').get('desc').setValue(this.form.get('achi').get('desc').value);
  }

  _search(terms: Observable<string>) {
    return terms.pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this._searchEntries(term)));
  }

  _searchEntries(term) {
    return this.http.get<Code>(environment.unique_achi, {observe: 'response',
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

  _csearch(terms: Observable<string>) {
    return terms.pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => this._csearchEntries(term)));
  }

  _csearchEntries(term) {
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
    this.term.next(value);
  }

  onCKeyup(value: string) {
    this.cterm.next(value);
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.add, this.codes, {headers: headers}).subscribe((response) => {
      this.error.status = false;
      this.error.message = 'Successfully added';
      this.form.reset();
      this.codes = [];
      this.addCodeNeedToShow = true;
      this.form.get('achi').enable();
    },
      error => {
        this.error.status = true;
        this.error.message = 'Oops! something went wrong';
      });
  }

  onFocus(value: string) {
    this.term.next(value);
  }
}
