import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * Guard function to check user permissions before routing.
 * @param {Object} route - The route being navigated to.
 * @param {Object} state - The current state of the route.
 * @returns {boolean} Returns true if user permissions are validated, otherwise redirects to login page.
 */
export const permissionsGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).guardValidation() ? true
  : inject(Router).navigate([`/login`]);

};

/**
 * Guard function to check user permissions before routing.
 * @param {Object} route - The route being navigated to.
 * @param {Object} state - The current state of the route.
 * @returns {boolean} Returns true if user isn't authenticated, otherwise redirects to home page.
 */
export const loginGuard: CanActivateFn = (route, state) => {
  return !(inject(AuthService).guardValidation()) ? true
  : inject(Router).navigate([`/home`]);

};

export const overseerGuard: CanActivateFn = (route, state) => {
  return (inject(AuthService).overseerValidation()) ? true
  : inject(Router).navigate([`/home`]);

};
