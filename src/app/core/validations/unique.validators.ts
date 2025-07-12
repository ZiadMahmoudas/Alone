// import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
// import { Auth } from "../services/auth/auth";
// import { catchError, map, of } from "rxjs";

// export function uniqueEmailValidator(auth: Auth): AsyncValidatorFn {
//   return (control: AbstractControl) => {
//     if (!control.value) return of(null);

//     return auth.checkEmail(control.value).pipe(
//       map((res: any) => {
//         console.log('Check Email Result', res);
//         return res.exists ? { emailTaken: true } : null;
//       }),
//       catchError((_) => of(null))
//     );
//   };
// }
