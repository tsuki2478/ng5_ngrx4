import {
  Component,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageListSelectComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
  ]
})
export class ImageListSelectComponent implements ControlValueAccessor {

  @Input() title = '选择';
  @Input() cols = 6;
  @Input() rowHeight = '64px';
  @Input() items: string[] = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = '64px';

  selected: string;
  constructor() { }
  private propagateChange = (_: any) => { };

  onChange(i) {
    this.selected = this.items[i];
    this.propagateChange(this.selected);  // 把这个变化通知表单
  }
  // 写值的。
  writeValue(obj: any): void {
    if (obj.img) {
      obj = obj.img;
    };
    this.selected = obj;
    console.log(obj);
  }

  // 当表单控件值改变时，函数 fn 会被调用 // 这也是我们把变化 emit 回表单的机制
  registerOnChange(fn: any): void {
    this.propagateChange = fn;

  }

  // 这里没有使用，用于注册 touched 时的回调函数

  registerOnTouched(fn: any): void { }
  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl): { [key: string]: any } {
    return this.selected ? null : {
      imageListInvalid: {
        valid: false
      }
    };
  }

}
