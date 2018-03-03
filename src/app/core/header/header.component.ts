import { getAuthState } from './../../reducers/index';
import { Auth } from './../../domain/auth.model';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// 注册
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  auth$: Observable<Auth>;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<boolean>();
  constructor(
    private store$: Store<fromRoot.State>
  ) {
  }

  ngOnInit() {
    this.auth$ = this.store$.select(getAuthState);
  }

  openSidebar() {
    this.toggle.emit();
  }
  onchange(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }
  logout() {
    this.store$.dispatch(new actions.LogoutAction(null));
    // this.auth$ = null;
  }
}
