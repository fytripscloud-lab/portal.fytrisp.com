import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(
    colorName: string,
    message: string,
    placementFrom: MatSnackBarVerticalPosition = 'bottom',
    placementAlign: MatSnackBarHorizontalPosition = 'center',
    duration: number = 2000
  ) {
    this.snackBar.open(message, '', {
      duration: duration,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  // Method for confirmation dialogs with action
  confirmDialog<T>(
    options: {
      title?: string;
      text?: string;
      icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
      confirmButtonText?: string;
      action: () => Promise<T> | Observable<T>;
      successMessage?: string;
    }
  ): Promise<any> {
    const {
      title = 'Are you sure?',
      text = 'Do you want to perform this action?',
      icon = 'warning',
      confirmButtonText = 'Yes, do it!',
      action,
      successMessage = 'Operation completed successfully.'
    } = options;

    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        // Handle both Promise and Observable
        const actionResult = action();
        
        // Convert Observable to Promise if needed
        const resultPromise = actionResult instanceof Observable ? 
          new Promise((resolve, reject) => {
            actionResult.subscribe({
              next: (result) => resolve(result),
              error: (error) => reject(error)
            });
          }) : actionResult;

        return resultPromise
          .then(response => {
            return response;
          })
          .catch(error => {            
            Swal.hideLoading();
            Swal.close();
            this.showNotification(
              'snackbar-danger',
              error.error.detail || 'An error occurred',
              'bottom',
              'center'
            );
            return Promise.reject(error);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.showNotification(
          'snackbar-success',
          successMessage,
          'bottom',
          'center'
        );
        return result.value;
      }
      return Promise.reject('cancelled');
    }).catch((error) => {
      if (Swal.isVisible()) {
        Swal.hideLoading();
        Swal.close();
        if( error.error.detail){
          this.showNotification(
            'snackbar-danger',
            error.error.detail,
            'bottom',
            'center'
          );
        }
        
      }
      return Promise.reject(error);
    });
  }

  // Simple success notification
  success(message: string) {
    this.showNotification('snackbar-success', message, 'bottom', 'center');
  }

  // Simple error notification
  error(message: string) {
    this.showNotification('snackbar-danger', message, 'bottom', 'center');
  }

  // Simple warning notification
  warning(message: string) {
    this.showNotification('snackbar-warning', message, 'bottom', 'center');
  }

  // Simple info notification
  info(message: string) {
    this.showNotification('snackbar-info', message, 'bottom', 'center');
  }
}
