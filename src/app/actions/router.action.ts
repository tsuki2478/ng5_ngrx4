import { Action } from '@ngrx/store';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

 
export class Go implements Action {
  readonly type = GO;
  constructor(public payload: {
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }) {
    console.log(payload);
  }
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

export type Actions
  = Go
  | Back
  | Forward;
