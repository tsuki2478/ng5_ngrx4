import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Identity } from './../../domain/user.model';
import { IdentityType } from '../../domain/index';
import { Subject } from 'rxjs/Subject';
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
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  identityTypes = [
    { value: IdentityType.IdCard, label: '身份证' },
    { value: IdentityType.Insurance, label: '医保' },
    { value: IdentityType.Passport, label: '福州' },
    { value: IdentityType.Military, label: '军官证' },
    { value: IdentityType.Other, label: '其他' },
  ];
  identity: Identity = { identityType: null, identityNo: null };

  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private sub: Subscription;

  private propagateChange = (_: any) => { };
  constructor() { }

  ngOnInit() {
    const val$ = Observable.combineLatest(this._idNo, this.idType, (_no, _type) => {
      return {
        identityType: _type,
        identityNo: _no
      };
    });
    this.sub = val$.subscribe(id => {
      this.propagateChange(id);
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onIdTypeChange(idType: IdentityType) {
    this._idType.next(idType);

  }
  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  // 转化一下
  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }


  get idNp(): Observable<string> {
    return this._idNo.asObservable();
  }


  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
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
    switch (val.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdCard(c);
      }

      case IdentityType.Passport: {
        return this.validatePassport(c);
      }

      case IdentityType.Military: {
        return this.validateMilitary(c);
      }

      case IdentityType.Insurance:
      default: {
        return null;
      }
    }
  }
  // 身份证的判断
  validateIdCard(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return { idInvalid: true };
    }
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    return pattern.test(val) ? null : { idNotValid: true };
  }

  // 护照
  validatePassport(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return { idInvalid: true };
    }
    const pattern = /^[GgEe]\d{8}$/;
    return pattern.test(val) ? null : { idNotValid: true };
  }

  // 军官证
  validateMilitary(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return pattern.test(val) ? null : { idNotValid: true };
  }
}
