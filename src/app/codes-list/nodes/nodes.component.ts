import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SearchService} from '../../search.service';
import {Code} from '../../code.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {List} from '../../code-list.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit, OnDestroy {

  @ViewChild('panel') panel: ElementRef;
  @ViewChild('icon') icon: ElementRef;
  @ViewChild('icon_add') icon_add: ElementRef;
  @ViewChild('btn') btn: ElementRef;
  @ViewChild('list') list: ElementRef;
  @Input()
  showAddBtnClicked: Subject<string>;
  @Input()
  formIndex = ' ';
  @Input()
  newCodeAdded: Subject<Code>;
  @Input()
  searchField: string;
  moreBtnText = 'Show All';

  @Input()
  code: Code;
  node_codes: Code[] = [];
  nextPageToken = 0;
  toggling = false;
  addBtnWasClicked = false;

  constructor(private http: HttpClient,
    private search: SearchService) {}

  ngOnInit() {
    // this.node_codes.push(this.code);
    // this.showAddBtnClicked.next('');
    this.showAddBtnClicked.subscribe((index) => {
      if (index === this.formIndex ||
        index === ' ') {
        // nothing
      } else {
        if (this.addBtnWasClicked) {
          this.icon_add.nativeElement.classList.replace('glyphicon-remove', 'glyphicon-plus');
          this.addBtnWasClicked = false;
        }
      }
    });
    this.newCodeAdded.subscribe((code) => {
      if (this.code.icd10 === code.icd10 &&
      this.code.adesc === code.adesc) {
        this.node_codes.push(code);
      }
    });
  }

  onMore() {
    if (this.node_codes.length < 1) {
      this.http.get<List>(environment.sub.concat(this.code.icd10)
      ).subscribe((response) => {
        for (const code of response.results[' ']) {
            this.node_codes.push(code);
        }
         // if (this.node_codes.length > 1) {
         //   this.toggle();
         // }
        // else {
        //   // hide toggle
        //    this.btn.nativeElement.style.visibility = 'hidden';
        // }
      });
    }
     this.toggle();
  }

  toggle() {
    this.toggling = !this.toggling;
    this.panel.nativeElement.style.maxHeight = (this.toggling === false) ? '5em' : '30em';
    this.panel.nativeElement.style.overflowY = (this.toggling === false) ? 'hidden' : 'auto';
    const icon_new = this.toggling ? 'glyphicon-resize-small' : 'glyphicon-resize-full';
    const icon_last = this.toggling ? 'glyphicon-resize-full' : 'glyphicon-resize-small';
    this.icon.nativeElement.classList.remove(icon_last);
    this.icon.nativeElement.classList.add(icon_new);
    this.moreBtnText = (this.toggling === false) ? 'Show All' : 'Hide';
    // this.panel.nativeElement.style.maxHeight = (this.panel.nativeElement.style.maxHeight === '30em') ? '5em' : '30em';
    // this.panel.nativeElement.style.overflowY = (this.panel.nativeElement.style.overflowY === 'auto') ? 'hidden' : 'auto';
    // if (this.icon.nativeElement.classList.contains('glyphicon-resize-full')) {
    //   this.icon.nativeElement.classList.replace('glyphicon-resize-full', 'glyphicon-resize-small');
    // } else {
    //   this.icon.nativeElement.classList.replace('glyphicon-resize-small', 'glyphicon-resize-full');
    // }
  }

  onAdd() {
    if (this.icon_add.nativeElement.classList.contains('glyphicon-plus')) {
      this.showAddBtnClicked.next(this.formIndex);
      this.icon_add.nativeElement.classList.replace('glyphicon-plus', 'glyphicon-remove');
      this.addBtnWasClicked = true;
    } else {
      this.showAddBtnClicked.next('');
      this.icon_add.nativeElement.classList.replace('glyphicon-remove', 'glyphicon-plus');
      this.addBtnWasClicked = false;
    }
    // if toggle is on
    // if (this.toggling) {
    //   this.toggle();
    // }

  }

  onClick(value: string, field: string) {
    this.search.searchField = field;
    this.search.termFromLinkClicked.next(value);
  }

  ngOnDestroy() {
  }
}
