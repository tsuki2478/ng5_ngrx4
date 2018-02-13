import { Observable } from 'rxjs/Observable';
import { isValidDate } from './../../utils/date.util';
// import { Observable } from 'rxjs/Rx';

import {
  Component,
  forwardRef,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { merge } from 'rxjs/operator/merge';
import {
  subDays, subMonths, subYears,
  differenceInMonths, differenceInYears,
  differenceInDays, isBefore, parse, format,
  isDate, isValid, isFuture,
} from 'date-fns';
import { Subscription } from 'rxjs/Subscription';
import { scheduleMicroTask } from '@angular/core/src/util';

export enum AgeUnit {
  Year = 0,
  Month = 1,
  Day = 2,
}

export interface Age {
  age: number;
  // unit是string类型，是可能是年，月，日。配合上面的显示几岁
  unit: AgeUnit;
}



@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
  ]
})

export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthTop = 24;
  @Input() monthBottom = 1;
  @Input() yearsTop = 150;
  @Input() yearsBottom = 1;
  @Input() format = 'YYYY-MM-DD';
  @Input() debounceTime = 300;

  selectedUnit = AgeUnit.Year;
  ageUnits = [
    { value: AgeUnit.Year, label: '岁' },
    { value: AgeUnit.Month, label: '月' },
    { value: AgeUnit.Day, label: '天' }
  ];

  //  初始化表单
  form: FormGroup;
  sub: Subscription;
  private propagateChange = (_: any) => { };

  constructor(private fb: FormBuilder) { }


  ngOnInit() {
    this.form = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, { validator: this.validateAge('ageNum', 'ageUnit') })
    });
    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    // 观测生日时间，出身日期
    const birthday$ = birthday.valueChanges
      .map(d => {
        return { date: d, from: 'birthday' };
      })
      // 0.3秒触发一次
      .debounceTime(this.debounceTime)
      // 上一次值和现在值一样时，不触发
      .distinctUntilChanged()
      .filter(_ => birthday.valid);
    // 依赖于birthday空间的正确性

    const ageNum$ = ageNum.valueChanges
      // 初始值
      .startWith(ageNum.value)
      // 0.3秒触发一次
      .debounceTime(this.debounceTime)
      // 上一次值和现在值一样时，不触发
      .distinctUntilChanged();
    const ageUnit$ = ageUnit.valueChanges
      //  初始值
      .startWith(ageUnit.value)
      // 0.3秒触发一次
      .debounceTime(this.debounceTime)
      // 上一次值和现在值一样时，不触发
      .distinctUntilChanged();

    // 上两者的合才会显示, 出身日期也要同步。所以要 转化成时间类。
    // 比如。我选择20岁。 那么输入20 ，在选择岁。 也就是2个值。。只有2个值都存在才会输出..出生日期也会同步。
    // 出生日期是时间类，所以string要转化过去
    // from的存在时为了判断是从哪里来的值。。
    const age$ = Observable
      .combineLatest(ageNum$, ageUnit$, (_n, _u) => {
        // 年龄转化成日期
        return this.toDate({ age: _n, unit: _u });
      })
      .map(d => {
        return { date: d, from: 'age' };
      })
      .filter(_ => this.form.get('age').valid);
    // 依赖于age的正确性验证

    // 只要观测这样一个就行了。 也就是订阅..
    const merged$ = Observable
      .merge(birthday$, age$)
      .filter(_ => this.form.valid);
    this.sub = merged$.subscribe(d => {
      // 日期转化成年龄
      const age = this.toAge(d.date);
      console.log('d.date: ' + d.date);
      console.log('转化后:' + age.age + age.unit);
      if (d.from === 'birthday') {
        console.log(ageNum.value);
        if (age.age !== ageNum.value) {
          console.log('age执行变化');
          ageNum.patchValue(age.age, { emitEvent: false });
        }
        console.log(ageUnit.value);
        console.log(this.selectedUnit);
        if (age.unit !== ageUnit.value) {
          console.log('unit执行变化');
          this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, { emitEvent: false });
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, { emitEvent: false });
          this.propagateChange(d.date);
        }
      }
    });
  }


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // 整体验证
  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (isValidDate(val)) {
      return null;
    }
    return {
      dateOfBirthInvalid: true
    };
  }

  // birthday验证
  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    return isValidDate(val) ? null : {
      birthdayInvalid: true
    };
  }

  // 验证formgroup 【是个工厂】
  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];

      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year: {
          result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearsTop;
          break;
        }
        case AgeUnit.Month: {
          result = ageNumVal >= this.monthBottom && ageNumVal < this.monthTop;
          break;
        }
        case AgeUnit.Day: {
          result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop;
          break;
        }
        default: {
          break;
        }
      }
      return result ? null : { ageInvalid: true };
    };
  }

  // 写值。可以改变value
  writeValue(obj: any): void {
    if (obj) {
      const date = format(obj, this.format);
      this.form.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.form.get('age').get('ageNum').patchValue(age.age);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any): void {
    // 这里可以接受到  注册页的 (change)值， 如果这里给个赋值。就可以认为改变(change)值
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();
    return isBefore(subDays(now, this.daysTop), date) ? { age: differenceInDays(now, date), unit: AgeUnit.Day } :
      isBefore(subMonths(now, this.monthTop), date) ? { age: differenceInMonths(now, date), unit: AgeUnit.Month } :
        {
          age: differenceInYears(now, date),
          unit: AgeUnit.Year
        };
  }

  toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year: {
        return format(subYears(now, age.age), this.format);
      }

      case AgeUnit.Month: {
        return format(subMonths(now, age.age), this.format);
      }
      case AgeUnit.Day: {
        return format(subDays(now, age.age), this.format);
      }
      default: {
        return null;
      }
    }
  }
}
