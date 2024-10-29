import { Pipe, PipeTransform } from '@angular/core';
import {environments} from "../../../../environments/environments";

@Pipe({
  name: 'serverImageUrl'
})
export class ServerImageUrlPipe implements PipeTransform {

  public staticContentUrl: string = environments.staticContentUrl;

  transform(value: string): unknown {
    return `${this.staticContentUrl}/${value}`;
  }
}
