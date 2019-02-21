import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SearchService} from '../search.service';
import {Code} from '../code.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('q') searchBar: ElementRef;
  constructor(public search: SearchService,
              private renderer: Renderer2) {
    this.search.termFromLinkClicked.subscribe((value) => {
      this.search.term = value;
      this.onKeyup(value);
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  onKeyup(term: string) {
    this.search.searchTerm.next(term);
  }
  onChange() {
      this.search.filter().subscribe((response) => {
        this.search.resultsChanged.next(response.results[' ']);
      },
        error => {
        const codes: Code[] = [];
        this.search.resultsChanged.next(codes);
        });
  }

  ngOnDestroy() {
    // this.search.termFromLinkClicked.unsubscribe();
  }
}
