import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholderolder',
})
export class PlaceholderolderPipe implements PipeTransform {

  transform(value: string, defecto: string = "sin texto") {

    // ABREBIAR ESTE
    // if (value) {
    //   return value
    // }else{
    //   return defecto;
    // }

    //A ESTE
    return ( value ) ? value : defecto;
  }
}
