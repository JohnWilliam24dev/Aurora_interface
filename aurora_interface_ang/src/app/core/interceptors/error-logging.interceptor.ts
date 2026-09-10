import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Substitui o interceptor de resposta do Config/AxiosClient.js legado,
 * que apenas logava o erro HTTP e repassava a rejeição adiante.
 */
export const errorLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erro HTTP:', error.error ?? error.message);
      return throwError(() => error);
    }),
  );
};
