import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  remembar = {
    KEY: 'project_auth02',
    PASSWORD: '!##0895*()?:}95047834&&tesdsfdsfsdf@EWdsd'
  };

  TEMP = {
    KEY: 'project_auth',
    PASSWORD: '90590348534YYIU!@00asfdadsf@£sxfcdf'
  };
  USER = {
    KEY: 'project_auth0',
    PASSWORD: '!##0895*()?:}95047834&&tes12323?ADSLklo'
  };


  constructor(
    private cookie: CookieService
  ) { }

  // DECRYPT THE COOKIES DATA BEFORE SAVE
  private encription(data: any, secret: string) {
    return CryptoTS.AES.encrypt(JSON.stringify(data), secret);
  }

  // DECRYPT THE COOKIES DATA
  private decription(data: any, secret: string) {
    const bytes = CryptoTS.AES.decrypt(data.toString(), secret);
    return JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  }

  //  SAVE USER COOKIES DATA OR LOGIN THE USER
  async setUser(data: any) {
    return this.cookie.set(this.USER.KEY, this.encription(data, this.USER.PASSWORD).toString(), 7, '/', '', false, 'Strict');
  }

  // GET SAVED USER COOKIES DATA
  getUser() {
    const DATA = this.cookie.get(this.USER.KEY) !== null ? this.cookie.get(this.USER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.USER.PASSWORD);
    } else {
      return undefined;
    }
  }

  // CLEAR USER COOKIES DATA OR LOGOUT THE USER
  clearUser() {
    this.cookie.delete(this.USER.KEY, '/');
    this.cookie.delete(this.USER.KEY, '/user');
    this.cookie.delete(this.USER.KEY, '/user/*');
  }

  // GET USER COOKIES DATA BY KEY NAME
  getDataField(type: string) {
    if (this.getUser() !== undefined && this.getUser()[type] !== undefined) {
      return this.getUser()[type];
    } else {
      return undefined;
    }
  }

  // DETECT USER'S TOEKN IS AVAIABLE OR NOT
  isAuthenticate(): boolean {
    return this.getDataField('token') !== undefined;
  }


  // SAVE REMEMBER ME OPTION IF EXIST
  setCredential(data: any) {
    return this.cookie.set(this.remembar.KEY, this.encription(data, this.remembar.PASSWORD).toString(), 365, '/');
  }

  // GET SAVED REMEMBER ME OPTION IF EXIST
  getCredential() {
    const DATA = this.cookie.get(this.remembar.KEY) !== null ? this.cookie.get(this.remembar.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.remembar.PASSWORD);
    } else {
      return false;
    }
  }

  // DELETE SAVED REMEMBER ME OPTION
  clearCredential() {
    this.cookie.delete(this.remembar.KEY, '/');
  }


  // SAVE TEMP DATA WHEN REQUIRED
  setTempData(data: any) {
    return this.cookie.set(this.TEMP.KEY, this.encription(data, this.TEMP.PASSWORD).toString());
  }

  // GET SAVED TEMP DATA
  getTempData() {
    const DATA = this.cookie.get(this.TEMP.KEY) !== null ? this.cookie.get(this.TEMP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.TEMP.PASSWORD);
    } else {
      return false;
    }
  }

  // DELETE ANY TEMP DATA IF EXIST
  clearTempData() {
    return this.cookie.delete(this.TEMP.KEY);
  }

}
