import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";

//firebase
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class FirebaseService {

  data: Observable<any[]>;
  imagenes:ArchivoSubir[] = [];
  lastKey:string = null;

  constructor(public http: HttpClient,
              private afDB: AngularFireDatabase,
              private toastCtrl:ToastController) {

    console.log("Servicio listo");
    this.getPost();
    this.cargar_ultimo_key().subscribe(()=>{
      this.cargar_imagenes();
    });
  }



  private cargar_ultimo_key(){
    return this.afDB.list('/post', ref => ref.orderByKey().limitToLast(1) )
             .valueChanges()
             .map( (post:any) => {
               console.log(post);
               this.lastKey = post[0].key;
               this.imagenes.push( post[0] );
             });
  }

  cargar_imagenes() {
    let promesa = new Promise((resolve, reject) => {
      this.afDB.list('/post',
        ref => ref.limitToLast(3)
          .orderByKey()
          .endAt(this.lastKey)
      ).valueChanges().subscribe((posts: any) => {

        posts.pop();

        if (posts.length == 0) {
          console.log("ya no hay más registros");
          resolve(false)
          return;
        }
        this.lastKey = posts[0].key;
        for (let i = posts.length - 1; i >= 0; i--) {
          let post = posts[i];
          this.imagenes.push(post);
        }
        resolve(true);
      });
    });
    return promesa;
  }

  getPost(){
    return this.data = this.afDB.list('post').valueChanges();
  }

  cargar_img_firebase( archivo:ArchivoSubir ){
    let promesa = new Promise( (resolve, reject) =>{
      this.showToast('Cargando...');
      let storeRef = firebase.storage().ref();
      let nombreArchivo:string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = 
          storeRef.child(`img/${nombreArchivo}`)
                  .putString( archivo.img, 'base64', { contentType: 'image/jpeg' } );

          uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 
          ()=>{}, // saber el porcentaje de cuantos Mbps se han subido
          (error) => {
            console.log("ERROR EN LA CARGA");
            console.log(JSON.stringify( error ));
            this.showToast( JSON.stringify( error ) );
            reject();
          },
          ()=>{
            // TODO: BIEN
            console.log("Archivo subido");
            this.showToast( "Imagen cargada correctamente" );
            let url = uploadTask.snapshot.downloadURL; //TODO: para obtener el URL importante
            this.crear_post( archivo.titulo, url, nombreArchivo );
            resolve();
          }

          )

    });
    return promesa;
  }

  private crear_post( titulo: string, url: string, nombreArchivo: string ){
    let post : ArchivoSubir = {
      img     : url,
      titulo  : titulo,
      key     : nombreArchivo
    }

    console.log(JSON.stringify( post ));
    // this.afDB.list('/post').push(post); alternativa
    this.afDB.object(`/post/${nombreArchivo}`).update( post );
    this.imagenes.push( post );

  };

  showToast( mensaje:string ){
    this.toastCtrl.create({
      message : mensaje,
      duration : 3000
    }).present();
  }

}

interface ArchivoSubir{
  titulo  : string;
  img     : string;
  key?    : string;
}