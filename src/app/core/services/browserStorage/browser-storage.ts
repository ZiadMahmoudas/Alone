import { Inject, Injectable } from '@angular/core';
import { BROSWER_STORAGE } from '../../tokens/token';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorage {

  constructor(@Inject(BROSWER_STORAGE) public storage:Storage) { }

  get(key:string){
    return this.storage.getItem(key);
  }
  set(key:string,value:string){
    this.storage.setItem(key,value);
  }
  remove(key:string){
    this.storage.removeItem(key);
  }
}
