import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { NotifyProvider } from '../../providers/notify/notify';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  private account = {
    name: '',
    gender: '',
    branch: '',
    year: '',
    phone_number: '',
    user_image_url: ''
  };

  private requests = {

  }
  private userAuth: any = { username: '', token: '' };

  constructor(
    public navCtrl: NavController,
    private notify: NotifyProvider,
    public menu: MenuController,
    private userData: UserDataProvider,
    private networkEngine: NetworkEngineProvider,
    public navParams: NavParams) {
    this.notify.presentLoading("Loading...");
    this.userData.getUsername().then((username: string) => {
      this.userData.getToken().then((token: string) => {
        this.notify.closeLoading();
        this.notify.presentLoading("Please wait..");
        this.userAuth.username = username;
        this.userAuth.token = token;
        this.networkEngine.post(this.userAuth, 'get-user-data').then(
          (result: string) => {
            this.notify.closeLoading();
            let data = JSON.parse(result);
            if (data._body) {
              data = JSON.parse(data._body).data[0];
              if (data) {
                this.account.name = data.name;
                this.account.gender = data.gender;
                this.account.branch = data.branch_name;
                this.account.year = data.year;
                this.account.phone_number = data.phone_number;
                this.account.user_image_url = data.user_image_url;
              }
              console.log(this.account);
            }
          },
          (err) => {
            this.notify.closeLoading();
            console.log(err);
          }
        );
      });
    });

  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true, 'loggedInMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

}
