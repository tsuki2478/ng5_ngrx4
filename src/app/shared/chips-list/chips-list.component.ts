import { UserService } from './../../services/user.service';
import { User } from './../../domain/user.model';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
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
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsListComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsListComponent),
      //  在元数据引用自己 forwardRef，当ImageListSelectComponent实例化后在引入 。。注册到依赖群里
      multi: true
    },
  ]
})
export class ChipsListComponent implements OnInit, ControlValueAccessor {
  @ViewChild('autoMember') autoMember;

  @Input() multiple = true;
  @Input() placeholderText = '请输入成员 email';
  @Input() label = '添加/修改成员';
  form: FormGroup;
  items: User[] = [];
  memberResults$: Observable<User[]>;

  constructor(private fb: FormBuilder, private service: UserService) { }

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });
    this.memberResults$ = this.form.get('memberSearch').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(s => s && s.length > 1)
      .switchMap(str => this.service.searchUsers(str));
    console.log(this.memberResults$);
  }
  // 这里是做一个空函数体，真正使用的方法在 registerOnChange 中
  // 由框架注册，然后我们使用它把变化发回表单
  // 注意，和 EventEmitter 尽管很像，但发送回的对象不同
  private propagateChange = (_: any) => { };

  // 写值。可以改变value
  // 设置初始值
  writeValue(obj: User[]): void {
    if (obj && this.multiple) {
      const userEntities = obj.reduce((e, c) => ({ ...e, c }), {});
      if (this.items) {
        const remaining = this.items.filter(item => !userEntities[item.id]);
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }
  // 当表单控件值改变时，函数 fn 会被调用
  // 这也是我们把变化 emit 回表单的机制
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    // 这里可以接受到  注册页的 (change)值， 如果这里给个赋值。就可以认为改变(change)值
  }
  registerOnTouched(fn: any): void { }


  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  public validate(c: FormControl) {
    return this.items ? null : {
      chipListInvalid: true
    };
  }



  removeMember(member: User) {
    const ids = this.items.map(item => item.id);
    const i = ids.indexOf(member.id);
    if (this.multiple) {
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
    } else {
      this.items = [];
    }
    this.form.patchValue({ memberSearch: '' });
    this.propagateChange(this.items);
  }

  handleMemberSelection(member: User) {
    if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
      return;
    }
    this.items = this.multiple ? [...this.items, member] : [member];
    this.form.patchValue({ memberSearch: member.name });
    this.propagateChange(this.items);
  }

  displayUser(user: User): string {
    return user ? user.name : '';
  }

  get displayInput() {
    return this.multiple || this.items.length === 0;
  }
}
