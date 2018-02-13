import { Http, HttpModule } from '@angular/http';
import { Component, Inject } from '@angular/core';
import { OverlayContainer } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  squareState: string;

  darkTheme = false;

  constructor(
    private oc: OverlayContainer,
    @Inject('BASE_CONFIG') private config,
    private http: Http,
  ) {
    console.log(config.url);
    const url = `${this.config.url}/quotes/${Math.floor(Math.random() * 10)}`;
    console.log(this.http.get(url));
  }

  switchTheme(dark) {
    this.darkTheme = dark;
    this.oc.themeClass = dark ? 'myapp-dark-theme' : null;
    console.log('切换');
  }
}



