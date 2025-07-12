import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(PLATFORM_ID) private plateformID:Object) { }
  setTheme(theme:'light'|'dark'){
    if(isPlatformBrowser(this.plateformID)){
      document.cookie = `theme=${theme};path=/;max-age=31536000`;
    }
  }

  getTheme():'light'|'dark'{
   if(isPlatformBrowser(this.plateformID)){
    const match = document.cookie.match(/theme=(dark|light)/);
    return match ? (match[1] as 'light'|'dark'): 'light';
   }
    return 'light';
  }
}
