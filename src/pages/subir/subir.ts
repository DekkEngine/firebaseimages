import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';

//servicio
import { FirebaseService } from "../../providers/firebase/firebase";

//plugin
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';


@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo:string = "";
  imagenPreview:string = "";
  imagen64:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private camera:Camera,
              private platform:Platform,
              private toastCtrl:ToastController,
              private imgPicker:ImagePicker,
              private _fs:FirebaseService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubirPage');
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

  mostrar_camara(){

    if (this.platform.is('cordova')) {      
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      
      this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:
       this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
       this.imagen64 = imageData;
      }, (err) => {
       // Handle error
       console.log("Error en camara", JSON.stringify( err ));
       
      });
    }else{
      this.showToast("Estas en pc :D");
    }

  }

  seleccionarFoto(){

    if (this.platform.is('cordova')) {
      let opciones: ImagePickerOptions = {
        quality: 70,
        outputType : 1,
        maximumImagesCount : 1
      }
  
      this.imgPicker.getPictures(opciones).then((results) => {
        for (var i = 0; i < results.length; i++) {
            // console.log('Image URI: ' + results[i]);
            this.imagenPreview = 'data:image/jpeg;base64,' + results[i];
            this.imagen64 = results[i];
        }
      }, (err) => { 
        console.log("ERROR en selecctor" + JSON.stringify( err ));
        
      }); 
    } else {
      this.showToast("Estas en pc :D");
    }
    
  }

  crear_post(){

    if (this.platform.is('cordova')) {      
      let archivo = {
        img     : this.imagen64,
        titulo  : this.titulo
      }
      this._fs.cargar_img_firebase( archivo ).then(() => {
        this.cerrar();
      })
    } else {
      this.showToast("Estas en pc :D");
    }


  }

  showToast(mensaje:string){
    let toast = this.toastCtrl.create({
      message : mensaje,
      duration : 3000
    }).present();
  }


}
