import { Injectable } from '@angular/core';

@Injectable()
export class DbHelperService {

  constructor() { }

  format(url: string, obj: string, fnc: string = 'get', params: any = {}): string {
    return url + '?obj=' + obj + '&fnc=' + fnc + '&prm=' + JSON.stringify(params);
  }

  formatPost(obj: string, fnc: string = 'get', params: any = {}): any {
    // return 'obj=' + obj + '&fnc=' + fnc + '&prm=' + JSON.stringify(params);
    // const ret = {
    //   obj: obj,
    //   fnc: fnc,
    //   params: params
    // }
    // const ret = {
    //   obj: obj,
    //   fnc: fnc,
    //   params: params
    // }

    // return ret;

    return 'obj=' + obj + '&fnc=' + fnc + '&prm=' + JSON.stringify(params);
  }

}
