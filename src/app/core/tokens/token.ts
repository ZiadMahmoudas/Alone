import { InjectionToken } from "@angular/core";

export const API_URL = new InjectionToken<string>('api_url');

export const BROSWER_STORAGE = new InjectionToken<Storage>("broswerstorage",{
  factory:()=> localStorage,
  providedIn:"root",
});
