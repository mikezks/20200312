import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer, Observable, Subscription, Subject } from 'rxjs';
import { tap, share, takeUntil, switchMap, debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-api';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {

  timer$: Observable<number>;
  timerSubscribtion: Subscription;
  destroy$ = new Subject<void>();

  control = new FormControl();
  flights$: Observable<Flight[]>;
  loading: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.rxjsDemo();

    this.flights$ =
      this.control.valueChanges
        .pipe(
          distinctUntilChanged(),
          filter(from => from.length > 2),
          debounceTime(300),
          tap(() => this.loading = true),
          switchMap(from => this.load(from)),
          tap(() => this.loading = false)
        );
  }

  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
  };

  rxjsDemo(): void {
    this.timer$ = timer(0, 1000)
      .pipe(
        tap(value => console.log('pipe', value)),
        takeUntil(this.destroy$),
        share()
      );

    /* this.timerSubscribtion = this.timer$
      .subscribe(console.log); */
  }

  ngOnDestroy(): void {
    //this.timerSubscribtion?.unsubscribe();
    this.destroy$.next();
  }

}
