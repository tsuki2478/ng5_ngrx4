import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';
import { DragDropService } from '../drag-drop.service';

@Directive({
  selector: '[app-draggable][dragTag][dragData][draggedClass]',
  // app-draggable, 指令的标识
})
export class DragDirective {

  private _isDraggable = false;

  @Input('app-draggable')
  set isDraggable(val: boolean) {
    this._isDraggable = val;
    this.rd.setAttribute(this.el.nativeElement, 'draggable', `${val}`);
  }

  get isDraggable() {
    return this._isDraggable;
  }


  @Input() draggedClass: string;
  @Input() dragTag: string;
  @Input()  dragData: any;
  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    // 严格来说就是操作DOM，添加class，child ，style，
    private service: DragDropService,
  ) { }

  @HostListener('dragstart', ['$event'])
  onDragStart(ev: Event) {
    // 这时候就可以判定是我发起的托拽
    if (this.el.nativeElement === ev.target) {
      // this.el是这个DOM节点， 增加一个class
      this.rd.addClass(this.el.nativeElement, this.draggedClass);
      this.service.setDragData({tag: this.dragTag, data: this.dragData});
    }
  }


  @HostListener('dragend', ['$event'])
  onDragEnd(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      // this.el是这个DOM节点， 增加一个class
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }
}
