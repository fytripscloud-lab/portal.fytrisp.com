import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgxEditorModule, Toolbar } from 'ngx-editor';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatCardModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxEditorModule
  ],
})
export class BlankComponent implements OnInit {
  isLinear = false;
  HFormGroup1!: UntypedFormGroup;
  HFormGroup2!: UntypedFormGroup;
  VFormGroup1!: UntypedFormGroup;
  VFormGroup2!: UntypedFormGroup;

  breadscrums = [
    {
      title: 'Blank',
      items: ['Extra'],
      active: 'Blank',
    },
  ];

  facilities = [
    { value: 'transfer', label: 'Transfer Included', img: 'assets/icons/private-car.png' },
    { value: 'stay', label: 'Stay Included', img: 'assets/icons/bedroom.png' },
    { value: 'meals', label: 'Meals Included', img: 'assets/icons/meal.png' },
    { value: 'sightseeing', label: 'Sightseeing Included', img: 'assets/icons/sightseeing.png' },
    { value: 'breakfast', label: 'Breakfast Included', img: 'assets/icons/breakfast.png' },
  ];

  selectedFacilities: Set<string> = new Set();
  numberValue: number = 0;

  toppings = new FormControl<string[]>([]); // Initialized with an empty array
  toppingList: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Lunch or Dinner'];

  //

  rooms = new FormControl<string[]>([]); // Initialized with an empty array
  roomsList: string[] = ['Standard', 'Deluxe', 'Super Deluxe', 'Luxury'];

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initializeFormGroups();
    this.editor = new Editor();
  }

  private initializeFormGroups(): void {
    this.HFormGroup1 = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.HFormGroup2 = this._formBuilder.group({
      address: ['', Validators.required],
    });

    this.VFormGroup1 = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.VFormGroup2 = this._formBuilder.group({
      address: ['', Validators.required],
    });
  }

  onFacilityChange(event: { value: string }): void {
    if (this.selectedFacilities.has(event.value)) {
      this.selectedFacilities.delete(event.value);
    } else {
      this.selectedFacilities.add(event.value);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = Array.from(input.files);
      console.log('Selected files:', files);
      // Process files as needed
    }
  }


//

editor?: Editor;
html = '';
toolbar: Toolbar = [
  ['bold', 'italic'],
  ['underline', 'strike'],
  ['code', 'blockquote'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
];

// ngOnInit(): void {
//   this.editor = new Editor();
// }

// make sure to destory the editor
ngOnDestroy(): void {
  this.editor?.destroy();
}

}
