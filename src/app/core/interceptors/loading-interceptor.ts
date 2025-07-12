import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

   const loadService = inject(LoaderService);
    loadService.show();
    return next(req).pipe(
      finalize(()=>{
          loadService.hide();
      })
    )
};
