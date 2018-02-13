import { AuthService } from './auth.service';
import { TaskService } from './task.service';
import { ProjectService } from './project.service';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { QuoteService } from './quote.service';
import { TaskListService } from './task-list.service';
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';


@NgModule()
export class ServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesModule,
            providers: [
                QuoteService,
              ProjectService,
              TaskListService,
              TaskService,
              UserService,
              AuthService,
              AuthGuardService,
            ]
        };
    }
}