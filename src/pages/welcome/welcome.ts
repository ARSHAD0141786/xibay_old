import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { TutorialsPage } from '../tutorials/tutorials';
import { TermsAndConditionPage } from '../terms-and-condition/terms-and-condition';
import { NotifyProvider } from '../../providers/notify/notify';
import { CameraPage } from '../camera/camera';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  responseData:any;
  constructor(public navCtrl: NavController,
    private logs: LogsServiceProvider,
    private notify: NotifyProvider,
    private networkEngine: NetworkEngineProvider) {
  }

  openCameraPage(){
    this.navCtrl.push(CameraPage);
  }
  loadTC(){
    this.logs.addLog("Loading Terms and condition page");
    this.navCtrl.push(TermsAndConditionPage);
  }
  openTutorials(){
    this.logs.addLog("Pushing tutorials page.");
    this.navCtrl.push(TutorialsPage);
  }
  loadLoginPage(){
    this.logs.addLog("Pushing login page");
    this.navCtrl.push(LoginPage);
  }

  loadRegistrationPage(){
    // if(this.connect.checkNetwork()){
      this.logs.addLog("Pushing registration page");
      this.navCtrl.push(RegistrationPage);
    // }else{
      // console.log("No internet");
      // this.notify.presentToast("No internet access");
    // }
  }
  testDB(){
    this.notify.presentLoading("Please wait...");
    this.networkEngine.get("test-db").then((result:string) => {
      this.responseData = JSON.parse(JSON.parse(result)._body);
      this.logs.addLog("Response :"+JSON.stringify(this.responseData));
      console.log(this.responseData);
      this.notify.presentToast("Success");
    }, (err:any) => {
      //Connection failed message
      console.log(err.status);
      this.logs.addLog(JSON.stringify(err));
      if(err.status != 0){
        this.responseData = JSON.parse(err._body);
      }else{
        this.responseData = err;
      }
      console.log(this.responseData);
      this.logs.addLog(this.responseData);
      if(this.responseData.Error){
        let error = this.responseData.Error.split(':')[0].split('[')[1].split(']')[0];
        let field = this.responseData.Error.split('key ')[1];
        console.log(field);
        if(error == '23000'){
          this.notify.presentToast(field + " already registered");    
        }else if(error == ''){
        }else if(error == ''){
        }else if(error == ''){
        }else if(error == ''){

        }else{
          this.notify.presentToast("Connection failed");
        }
      }else{
        this.notify.presentToast("Connection failed");
      }
      this.notify.closeLoading();
      // this.notify.presentToast("Connection failed");
      // this.logs.addLog("Error : " + JSON.stringify(this.responseData));
    });
  }
}
