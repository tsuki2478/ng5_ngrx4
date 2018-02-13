import { DragData } from './drag-drop.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface DragData {
  tag: string;
  data: any;
  // 定义类型和数据结构， tag是唯一标识。。能识别多重拖拽
  // dat是传送的数据
}

@Injectable()
export class DragDropService {
  // BehaviorSubject特点，总能记住上一次的值，
  private _dragData = new BehaviorSubject<DragData>(null);

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }
  clearDragData() {
   return    this._dragData.next(null);
  }

}
