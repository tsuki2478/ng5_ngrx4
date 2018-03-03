import { getQuote } from './../../reducers/quote.reducer';
import { Observable } from 'rxjs/Observable';
import { Quote } from './../../domain/quote.model';
import { QuoteService } from './../../services/quote.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// 注册
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  // quote: Quote = {
  //   cn: '来自二次元的乙女... ',
  //   en: '呐!  我到底要用怎么样的速度生活才能与你再次相遇...',
  //   pic: '/assets/covers/44.jpg'
  // };
  quote$: Observable<Quote>;

  // FormGroup是一组。
  // FormBuilder是为了简化多个组的建立
  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService,
    private store$: Store<fromRoot.State>
  ) {
    // 先得到state，这是个流
    // this.quote$ = this.store$.select(state => state.quote.quote);
    this.quote$ = this.store$.select(fromRoot.getQuote);
    // this.store$.dispatch({type: actions.QUOTE});
    // this.quoteService$
    // .getQuote()
    // .subscribe(q => {
    // { type: actions.QUOTE_SUCCESS, payload: q }
    // this.store$.dispatch(new actions.LoadSuccessAction(q));
    // });
  }

  ngOnInit() {
    // 必须初始化全部formControl表单
    // Validators是验证器，单纯认真不为空 Validators.required。
    // @qq.com是初始值 。

    // 这样方式适合单个group，
    /*
    this.form = new FormGroup({
      email: new FormControl('11@qq.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
*/
    // 这样方式适合多个复杂group
    this.form = this.fb.group({
      email: ['yy@qq.com', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    });
    this.store$.dispatch(new actions.LoadAction(null));
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    // console.log(JSON.stringify(value));
    // console.log(valid);

    // 搭配 NGRX 使用
    if (!valid) {
      return;
    }
    this.store$.dispatch(new authActions.LoginAction(value));

    // 这里可以动态验证
    // this.form.controls['email'].setValidators(this.validate);
  }


  // 自定义认证器
  validate(c: FormControl): { [key: string]: any } {
    if (!c.value) {
      return null;
    }
    // 前面需要携带什么
    const pattern = /^yy+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNotValid: ' the email  must start  with  wang'
    };
  }
}
