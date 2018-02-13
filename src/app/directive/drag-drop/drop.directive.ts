import { DragData } from './../drag-drop.service';
import { Directive, HostListener, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { DragDropService } from '../drag-drop.service';

@Directive({
  selector: '[app-droppable][dropTags][dragEnterClass]'
})
export class DropDirective {

  @Output() dropped = new EventEmitter<DragData>();
  @Input() dragEnterClass: string;
  @Input() dropTags: string[] = [];
  // 可能支持多个tag，所以定义成数组。
  private data$;

  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    private service: DragDropService,
  ) {
    this.data$ = this.service.getDragData().take(1);
  }


  @HostListener('dragenter', ['$event'])
  onDragEnter(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    // 这时候就可以判定是我发起的托拽
    if (this.el.nativeElement === ev.target) {
      // 取得data$时候,判断dropTags是否还有dragData.tag
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.addClass(this.el.nativeElement, this.dragEnterClass);
        }
      });
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    // 这时候就可以判定是我发起的托拽
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        // 取得data$时候,判断dropTags是否还有dragData.tag
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'all');
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'move');
        } else {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'none');
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'none');

        }
      });
    }
  }


  @HostListener('dragleave', ['$event'])
  onDragLeave(ev: Event) {
  // 防止时间冒泡
    ev.preventDefault();
    ev.stopPropagation();
    // 这时候就可以判定是我发起的托拽
      if (this.el.nativeElement === ev.target) {
        // 取得data$时候,判断dropTags是否还有dragData.tag
        this.data$.subscribe(dragData => {
          if (this.dropTags.indexOf(dragData.tag) > -1) {
            // this.el是这个DOM节点， 增加一个class
            this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
          }
        });
      }
  }

  @HostListener('drop', ['$event'])
  onDrop(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    // 这时候就可以判定是我发起的托拽
    if (this.el.nativeElement === ev.target) {
      // 取得data$时候,判断dropTags是否还有dragData.tag,
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          // this.el是这个DOM节点， 增加一个class
          this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
          this.dropped.emit(dragData);
          this.service.clearDragData();
        }
      });
    }
  }


}
