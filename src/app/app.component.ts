import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { filter, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  // data$ = this.http.get<any>('./assets/data/data.json');
  data$ = this.http.get<any>('./assets/data/dataFull.json');

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {}

}
