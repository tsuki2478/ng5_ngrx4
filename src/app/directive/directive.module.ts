import { DragDropService } from './drag-drop.service';
import { NgModule } from '@angular/core';
 import { DragDirective } from './drag-drop/drag.directive';
import { DropDirective } from './drag-drop/drop.directive';

@NgModule({
  exports: [
    DragDirective,
    DropDirective,
  ],
  declarations: [DragDirective, DropDirective],
  providers: [
    DragDropService
  ]
})
export class DirectiveModule { }
