import { getProvinces, getCitiesByProvince, getAreaByCity } from './../../utils/area.util';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Address } from './../../domain/user.model';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  // 用subject方法
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;

  sub: Subscription;
  private propagateChange = (_: any) => { };

  constructor() { }

  ngOnInit() {
    const province$ = this._province.asObservable().startWith('');
    const city$ = this._city.asObservable().startWith('');
    const district$ = this._district.asObservable().startWith('');
    const street$ = this._street.asObservable().startWith('');
    const val$ = Observable.combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    });
    // 订阅
    val$.subscribe(v => {
      // 发布出去
      this.propagateChange(v);
    });
    // 函数数组 转化成流
    this.provinces$ = Observable.of(getProvinces());
    console.log(this.provinces$);
    this.cities$ = province$.map((p: string) => getCitiesByProvince(p));
    console.log(this.cities$);
    this.districts$ = Observable.combineLatest(province$, city$, (p: string, c: string) => getAreaByCity(p, c));
    console.log(this.districts$);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Address): void {
     if (obj) {
      this._address = obj;
       if (this._address.province) {
        this._province.next(this._address.province);
      }

      if (this._address.city) {
        this._city.next(this._address.city);
      }

      if (this._address.district) {
        this._district.next(this._address.district);
      }

      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
   }
  registerOnTouched(fn: any): void {
  }

  // 整体验证
  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    };
  }


  // 发射事件
  onProvinceChange() {
    console.log('111111111')
    this._province.next(this._address.province);
  }
  onCityChange() {
    console.log('2222222222')

    this._city.next(this._address.city);
  }
  onDistrictChange() {
    console.log('33333333333')
    this._district.next(this._address.district);
  }
  onStreetChange() {
    console.log('44444444444444')

    this._street.next(this._address.street);
  }
}
