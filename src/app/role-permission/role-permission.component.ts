import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@shared/alert.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-role-permission',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf],
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.scss'
})
export class RolePermissionComponent {

  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Role Permission',
      items: ['Home'],
      active: 'Role Permission',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  menuLists: any = [];  
  adminUsers: any = [];
  masterService = inject(MasterService);
  alertService = inject(AlertService);

   constructor(
      private toastr: ToastrService,
      public dialog: MatDialog,
    ) { 
  
    }

    ngOnInit(): void {
      this.loadData();    
    }

    toggleCheckbox(event: any) {
      if (event.target.type !== 'checkbox') {
        const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
    }
  
    loadData() {
      this.isLoading = true;
      this.masterService.getMenuLists().subscribe({
        next: (res: any) => {
          this.menuLists = res.data;
        },
        error: (error) => {
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

      this.masterService.getAdminUserLists({}).subscribe({
        next: (res: any) => {
          this.menuLists = res.data;
        },
        error: (error) => {
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

    getRolePermission(userId:string){
      this.masterService.getRolePermissionListByUser(userId).subscribe((resp:any)=>{

      })
    }
}
