import { cardAnim } from './../../animates/card.anim';
import { Component, OnInit,   Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
 
 @Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations  : [
    cardAnim
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProjectItemComponent implements OnInit {

  // 笨组件，只有输入值变了才会发生变化
  @Input() item;
  @Output() Invite = new EventEmitter<void>();

  @Output() Edit = new EventEmitter<void>();

  @Output() Delete = new EventEmitter<void>();

  @HostBinding('@card') cardState = 'out';
  // 相当于在html 写上  [@card]='cardState'

  constructor(
   ) { }

  ngOnInit() {
  }

  // // 监听数组事件的。 意思是监听渲染后的整整个组件的数组，()可以添加传参。比如('click',['$event.target'])   onMouseEnter(event)

  // // 监视鼠标移动到某位置
  @HostListener('mouseenter', )
  onMouseEnter() {
    this.cardState = 'hover';
  }
  //  鼠标离开
  @HostListener('mouseleave', )
  onMouseleave() {
    this.cardState = 'out';
  }

  // 邀请
  onInviteClick() {
    this.Invite.emit();
  }

  // 编辑
  onEditClick() {
    this.Edit.emit();
  }

  // 删除
  ondeleteClick() {
    this.Delete.emit();
   }
}
