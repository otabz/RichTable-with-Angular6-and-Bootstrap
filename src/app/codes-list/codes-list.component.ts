import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {SearchService} from '../search.service';
import {Code} from '../code.model';
import {ActivatedRoute, Router} from '@angular/router';
import {List} from '../code-list.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.css']
})
export class CodesListComponent implements OnInit, OnDestroy {

  showAddBtnClicked = new Subject<string>();
  newCodeAdded = new Subject<string>();
  showAddForm = ' ';

  message = 'Start your search - by typing keywords';
  isMore = true;
  infoIcon = 'glyphicon glyphicon-search';

  // codes: Code[] = [
  //   //   new Code('SKU090088', '17262786', '16 S-SEQUENCING (ON SPECIFIC REQUEST)( SO )'),
  //   //   new Code('SKU090088', '17262786', '(ANTI RNP/ANTI SM)( SO )'),
  //   //   new Code('SKU090088', '17262786', 'ADENOSINE 3 5 MONOPHOSPATE CYCLIC AMP( SO )'),
  //   //   new Code('SKU090088', '17262786', 'ALPHA MANNOSIDASE PROTEIN ANALYSIS AND LEUCOCYTE PREPARATION( SO )'),
  //   //   new Code('SKU090088', '17262786', 'AMNIOTIC FLUID CHROMOSOME ANALYSIS+ RAPID ANEUPLOIDY SCREENING (INTERPHASE FISH)'),
  //   //   new Code('SKU090088', '17262786', 'AMNIOTIC FLUID CHROMOSOME ANALYSIS+ RAPID ANEUPLOIDY SCREENING (INTERPHASE FISH)'),
  //   //   new Code('SKU090088', '17262786', 'AMNIOTIC FLUID CHROMOSOME ANALYSIS+ RAPID ANEUPLOIDY SCREENING (INTERPHASE FISH)')
  //   // ];

  codes: Code[] = [];

  constructor(private search: SearchService,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.search.nextPageToken = 0;
    this.search.isSearchDisabled = false;
    this.codes = (<List>this.route.snapshot.data['result']).results[' '];
    this.search.resultsChanged.subscribe((results) => {
     this.codes = results;
     this.isMore = true;
     if ((<any[]>results).length === 0) {
       this.message = 'your search - ' + this.search.term + ' - did not match any data.';
       this.infoIcon = 'glyphicon glyphicon-exclamation-sign';
     }
     this.showAddForm = ' ';
   });
    this.showAddBtnClicked.subscribe((val) => {
      console.log('addForm: ' + val);
      if (this.showAddForm !== ' ') {

      }
      this.showAddForm = val;
    });
  }

  // ngAfterViewChecked() {
  //   if (this.showAddForm === '') {
  //     this.cdRef.detectChanges();
  //   }
  // }

  onMore() {
    this.search.more().subscribe((response) => {
      for (const code of response.results[' ']) {
        this.codes.push(code);
      }
      if ((<any[]>response.results[' ']).length === 0) {
          this.isMore = false;
      }
    });
  }

  onClick(value: string, field: string) {
    // this.router.navigate([code], {queryParams: {t: 'achi_code', d: desc, f: field}});
    this.search.searchField = field;
    // this.search.term = value;
    this.search.termFromLinkClicked.next(value);
    // this.search.filter().subscribe((response) => {
    //   this.search.resultsChanged.next(response.results[' ']);
    // });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.innerHeight = window.innerHeight;
    // console.log(this.innerHeight);
  }


  ngOnDestroy() {
    // this.search.resultsChanged.unsubscribe();
    // this.showAddBtnClicked.unsubscribe();
  }
}
