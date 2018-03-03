import { ProjectEffects } from './project.effects';
// ng-module
import { QuoteEffects } from './quote.effects';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';
import { TaskEffects } from './task-list.effects';

@NgModule({
    imports: [
        // EffectsModule.run(QuoteEffects)
        EffectsModule.forRoot([
            QuoteEffects,
            AuthEffects,
            ProjectEffects,
            TaskEffects,
        ])
    ],
})
export class AppEffectsModule { }