import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-destination-route',
  standalone: true,
  imports: [
          MatButtonModule,
          MatIconModule,
          MatDialogContent,
          FormsModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatSelectModule,
          MatOptionModule,
          MatInputModule,
          NgxMatSelectSearchModule,
          AsyncPipe,
          MatCardModule,
          MatProgressSpinnerModule,
          NgIf,
          NgClass
      ],
  templateUrl: './edit-destination-route.component.html',
  styleUrl: './edit-destination-route.component.scss'
})
export class EditDestinationRouteComponent {
  editRouteForm: UntypedFormGroup;
  availableRoutes: any[] = [];
  dialogTitle: string = 'Edit Destination Route';
  routeList: any[] = [];
  routeData: any;
  dayCount: number = 0;
  tripDuration: number = 0;
  searchCtrl = new FormControl('');
  filteredRoutes$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditDestinationRouteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {

    this.dialogTitle = data.title;
    this.dayCount = data.dayCount;
    this.tripDuration = data.tripDuration;
    this.routeList = data.routeList;
    this.routeData = data.routeData;
    this.editRouteForm = this.editRouteFormcontrol(data);

    this.filteredRoutes$.next(this.routeList);
        this.searchCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(search => {
          if (!search) {
            this.filteredRoutes$.next(this.routeList.slice());
            return;
          }
          
          // Filter the destinations
          const searchStr = search.toLowerCase();
          const filtered = this.routeList.filter((route: { route_name: string; }) => 
            route.route_name.toLowerCase().includes(searchStr)
          );
          this.filteredRoutes$.next(filtered);
        });
  }

  editRouteFormcontrol(data: any): UntypedFormGroup {
    if(this.routeData?.no_of_days_stay){
      this.dayCount = this.dayCount-parseInt(this.routeData?.no_of_days_stay);
    }
    const routeData = data.routeData;
      return this.formBuilder.group({
        id: [routeData?.id],
        tour_package_id: [data?.packageId, [Validators.required]],
        route_id: [routeData?.route?.id, [Validators.required]],
        no_of_days_stay: [routeData?.no_of_days_stay, [Validators.required]],        
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveFormdata(): void {
    if (this.editRouteForm.valid) {
      const totalDay = this.dayCount+parseInt(this.editRouteForm.value.no_of_days_stay);
      console.log(totalDay);
      if(totalDay>this.tripDuration){
        this.toastr.error('Trip Duration should be less than or equal to '+(this.tripDuration-this.dayCount));
        return;
      }
      this.isLoading=true;
      this.masterService.addTourDestination(this.editRouteForm.getRawValue()).subscribe((resp:any)=>{
        if(resp.message){
          this.isLoading=false;
          this.dialogRef.close(1);
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error.error.detail);
      });
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
