import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


import { SubirPage } from "../subir/subir";

//servicios
import { FirebaseService } from "../../providers/firebase/firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas:boolean = true;

  constructor(public navCtrl: NavController,
              private modalCtrl:ModalController,
              private _fs:FirebaseService,
              private socialSharing: SocialSharing) {
          
  }

  mostrarModal(){
    let modal = this.modalCtrl.create( SubirPage );
    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this._fs.cargar_imagenes().then( 
      ( hayMas:boolean )=> {
        console.log(hayMas);
        this.hayMas = hayMas;
        infiniteScroll.complete()
      }
     );

  }

  compartir( post:any ){
    // Share via email
    this.socialSharing.shareViaFacebook( post.titulo, post.img, post.img )
        .then(()=>{}) //Se pudo compartir
        .catch((error) =>{}) //Si sucede un error
  }

}
