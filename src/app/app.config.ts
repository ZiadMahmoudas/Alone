import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withEnabledBlockingInitialNavigation, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions, withIncrementalHydration } from '@angular/platform-browser';
import { environment } from './core/environment/environment.dev';
import { API_URL } from './core/tokens/token';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { CustomTitleStrategy } from './core/DynamicTitle/TitleStrategy';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { handleErrorInterceptor } from './core/interceptors/handle-error-interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withViewTransitions()),
    provideClientHydration(withEventReplay(),withIncrementalHydration(),withHttpTransferCacheOptions({includePostRequests:true})),
    {provide:API_URL,useValue:environment.apiUrl},
     {
  provide: TitleStrategy,
  useClass: CustomTitleStrategy
},
    {
      provide:IMAGE_CONFIG,
      useValue:{
        disableImageSizeWarning:true,
        disableImageLazyLoadWarning:true
      }
    },
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
provideAnimations(),
   provideHttpClient(withInterceptors([loadingInterceptor,handleErrorInterceptor]),withFetch()),
importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ],


};
