import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastrService) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error.detail || 'Invalid request';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          break;
        case 403:
          errorMessage = error.error.detail || 'Access forbidden';
          break;
        case 404:
          errorMessage = error.error.detail || 'Resource not found';
          break;
        case 409:
          errorMessage = error.error.detail || 'User already exists';
          break;
        case 422:
          errorMessage = error.error.detail || 'Invalid input data';
          break;
        case 500:
          errorMessage = error.error.detail || 'Server error';
          break;
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection';
          break;
      }
    }

    this.toastr.error(errorMessage, 'Error');
    return errorMessage;
  }
}
