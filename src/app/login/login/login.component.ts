import { Quote } from './../../domain/quote.model';
import { QuoteService } from './../../services/quote.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  quote: Quote = {
    cn: '来自二次元的乙女... ',
    en: '呐!  我到底要用怎么样的速度生活才能与你再次相遇...',
    pic: '/assets/covers/44.jpg'
  };

  form: FormGroup;
  // FormGroup是一组。
  // FormBuilder是为了简化多个组的建立
  constructor(private fb: FormBuilder,
    private quoteService$: QuoteService,
  ) {
    this.quoteService$
      .getQuote()
      .subscribe(q => this.quote = q);
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
      email: ['111@local.dev', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify(value));
    console.log(valid); 

    // 这里可以动态验证
    // this.form.controls['email'].setValidators(this.validate);
  }


  // 自定义认证器
  validate(c: FormControl): { [key: string]: any } {
    if (!c.value) {
      return null;
    }
    const pattern = /^111+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNotValid: ' the email  must start  with  wang'
    };
  }
}
