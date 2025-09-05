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

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './admin-logs.component.html',
  styleUrl: './admin-logs.component.scss'
})
export class AdminLogsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;

  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Admin API Logs',
      items: ['Home'],
      active: 'Admin API Logs',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  pageListData: any = [];  
  masterService = inject(MasterService);

   constructor(
      private toastr: ToastrService,
    ) { 
  
    }

  ngOnInit(): void {
      this.loadData();    
      this.searchSubject.pipe(
        debounceTime(300), // Wait 300ms after last input
        distinctUntilChanged() // Only emit if value changed
      ).subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
    }
  
    onSearch(searchTerm: string) {
      this.searchSubject.next(searchTerm);
    }
  
    private performSearch(searchTerm: string) {
      if (!searchTerm) {
        this.loadData(); // Reset to full list if search is empty
        return;
      }
  
      this.isLoading = true;
      this.loadData(1, this.pageSize, searchTerm)
    }
    
    loadData(page: number = 1, pageSize: number = 10, search='') {
      this.isLoading = true;
      this.masterService.adminApiLogs({page, page_size:pageSize, search}).subscribe({
        next: (res: any) => {
          this.pageListData = res.data;                 
          this.totalPages = res.pagination?.total_pages;
  
          this.totalItems = res.pagination?.total_items;
          this.currentPage = res.pagination?.current_page - 1; // Convert to 0-based
          this.pageSize = res.pagination?.page_size;
          
  
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.pageSize = this.pageSize;
              this.paginator.length = this.totalItems;
            }
          });
        },
        error: (error) => {
          // this.showNotification(
          //   'snackbar-error',
          //   'Error loading route',
          //   'bottom',
          //   'center'
          // );
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  
    onPageChange(event: PageEvent) {
      const pageIndex = event.pageIndex + 1; // Convert to 1-based for API
      const pageSize = event.pageSize;
      if(pageIndex>1){
        this.pageRow = this.pageSize*event.pageIndex;
      }else{
        this.pageRow = 0;
      }
      
      this.loadData(pageIndex, pageSize);
    }
  
    getRowNumber(index: number): number {
      return this.pageRow+index+1;
    }
  
    refresh() {
      this.loadData(this.currentPage+1);
    }

}
