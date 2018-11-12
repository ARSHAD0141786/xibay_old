import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { UserDataProvider } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {

  /* branch: "Array"
  category_fk: "5"
  created: "1526101255"
  description: "Cute person
  "id: "41"
  image_url: "http://192.168.43.50/xibay/public_html/photo/img-20180512-5af675074d09cionicfile.jpg"
  is_hidden: "0"
  title: "ARSHAD"
  total_requests: "0"
  username_fk: "u"
  year: "Array" */
  
  private userPostData = {
    token:'',
    username:'',
    item_id:''
  };

  private content = {
    title:'',
    imageUrl:'',
    description:'',
    usefulYear:[],
    usefulBranch:[],
    userCreated:'',
    user:'',
  };

  

  constructor(
    public navCtrl: NavController,
    private network:NetworkEngineProvider, 
    private userData:UserDataProvider,
    public menu:MenuController,
    private notify:NotifyProvider,
    public navParams: NavParams) {
    let item:any  = navParams.data;
    this.content.title = item.title;
    this.content.description = item.description;
    this.content.imageUrl = item.image_url;
    this.content.usefulYear = JSON.parse(item.year);
    this.content.usefulBranch = JSON.parse(item.branch);
    this.content.userCreated = item.created;
    this.content.user = item.username_fk;

    this.notify.presentLoading("Please wait...");
    this.userData.getUsername().then((username)=>{
      this.userPostData.username = username;
      this.userData.getToken().then((token)=>{
        this.notify.closeLoading();
        this.userPostData.token = token;
        this.userPostData.item_id = item.id;
      });
    });

    console.log(this.content);
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
    console.log('ionViewDidLoad DescriptionPage');
  }

  sendRequest(){
      this.notify.presentLoading("Sending request...");
      this.network.post(this.userPostData,'send-request').then((response:string)=>{
        console.log(response);
        let data = JSON.parse(response);
        console.log(data);
        if(data._body){
          console.log(data._body);
          let d = JSON.parse(data._body);
          console.log(d);
          if(d.message){
            this.notify.presentToast('Request sent succesfully');
          }else if(d.error){
            console.log("D.code : " + d.code);
            if(d.code == 1){ // SQL error
              let Error = d.error.split(':')[0].split('[')[1].split(']')[0];
              console.log(Error);
              if(Error == 23000){
                this.notify.presentToast("Request already sent.");
              }
            }else{
              this.notify.presentToast('Error : '+d.error);
            }
          }else{
            this.notify.presentToast("Something went wrong");
          }
        }
      },(err)=>{
        this.notify.presentToast("error : "+JSON.stringify(err));
      });
  }
}