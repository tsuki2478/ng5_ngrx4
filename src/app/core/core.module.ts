import { ServicesModule } from './../services/services.modoule';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpModule } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { loadSvgResources } from '../utils/svg.util';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { AppRoutingModule } from '../app-routing.module';
import '../utils/debug.util';
import { AppEffectsModule } from '../effects';
import {AppStoreModule} from '../reducers';

import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';


@NgModule({
  imports: [
    HttpModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    AppStoreModule,
    AppEffectsModule,
    ServicesModule.forRoot(),
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent],
  /*导出  */
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule,
  ],
  // url地址。
  providers: [
    {
      provide: 'BASE_CONFIG', useValue: {
        url: 'http://localhost:3000'
      }
    }
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parent: CoreModule,
    ir: MdIconRegistry, ds: DomSanitizer
  ) {
    if (parent) {
      throw new Error('模块已经存在，不能再次加载');
    }
    loadSvgResources(ir, ds);
  }
}
