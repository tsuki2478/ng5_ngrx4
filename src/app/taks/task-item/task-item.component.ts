import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { itemAnim } from '../../animates/item.anim';


@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    itemAnim
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent implements OnInit {

  @Input() item;
  @Input() avatar;
  @Output() taskClick = new EventEmitter<void>();
  widerPriority = 'in';
  constructor() {
 
    // this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
  }

  ngOnInit() {

  }
  onItemClick() {
    this.taskClick.emit();
  }


  onCheckBoxClick(ev: Event) {
    ev.stopPropagation();
    // 终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。虽然该方法不能阻止同一个 Document 节点上的其他事件句柄被调用，但是它可以阻止把事件分派到其他节点
  }

  @HostListener('mouseenter')
  onmouseEnter() {
    this.widerPriority = 'out';
  }

  @HostListener('mouseleave')
  onmouseLeave() {
    this.widerPriority = 'in';
  }
}
