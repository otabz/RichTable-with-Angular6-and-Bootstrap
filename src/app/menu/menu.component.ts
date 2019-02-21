import {Component, OnInit} from '@angular/core';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private search: SearchService) {
    this.search.term = '';
    this.search.searchField = 'description';
  }

  ngOnInit() {
    this.search.isSearchDisabled = true;
  }
}
