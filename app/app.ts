import 'chart.js/dist/Chart.min';
import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {DashboardPage} from './pages/dashboard/dashboard';
import {ListPage} from './pages/list/list';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = DashboardPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Dashboard', component: DashboardPage },
      { title: 'History', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
