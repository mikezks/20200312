import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer, Observable, Subscription, Subject } from 'rxjs';
import { tap, share, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {

  timer$: Observable<number>;
  timerSubscribtion: Subscription;
  destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.rxjsDemo();
  }

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
