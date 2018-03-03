import { isValidDate } from './../../utils/date.util';
import { Subscription } from 'rxjs/Subscription';
import { getAddrByCode, isValidAddr, extractInfo } from './../../utils/identity.util';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  items: string[];
  sub: Subscription;
  private readonly avatarName = 'avatars';
  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;
    const nums = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    console.log(img);
    this.form = this.fb.group({
      email: [],
      name: [],
      password: [],
      repeat: [],
      avatar: [img],
      dateOfBirth: ['1990-01-01'],
      address: [],
      identity: []
    });
    const id$ = this.form.get('identity').valueChanges
      .debounceTime(300)
      // ，0.3秒一次 。验证通过才放行
      .filter(v => this.form.get('identity').valid);
    this.sub = id$.subscribe(id => {
      const info = extractInfo(id.identityNo);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.get('address').patchValue(addr);
      }

      if (isValidDate(info.dateOfBirth)) {
        this.form.get('dateOfBirth').patchValue(info.dateOfBirth);
      }
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    console.log(value);
    // value就是符合user结构的对象
    this.store$.dispatch(new authActions.RegisterAction(value));
  }
}
