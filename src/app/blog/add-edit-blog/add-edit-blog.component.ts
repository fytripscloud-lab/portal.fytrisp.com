import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ValidationService } from '@shared/validation.service';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-add-edit-blog',
  standalone: true,
  imports: [BreadcrumbComponent, MatIconModule, MatButtonModule, MatProgressSpinnerModule, NgxEditorModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule, RouterLink, FileUploadComponent, MatCardModule, MatTooltipModule, MatSelectModule, NgxMatSelectSearchModule],
  templateUrl: './add-edit-blog.component.html',
  styleUrl: './add-edit-blog.component.scss'
})
export class AddEditBlogComponent implements OnInit {

  breadscrums = [
    {
      title: 'Add Blog',
      items: ['Home'],
      active: 'Add Blog',
    },
  ];

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
  selectedFiles: File[] = [];

  blogForm: UntypedFormGroup;
  imagePreviews: string = '';
  blogId: string = '';
  blogData: any = {};
  isLoading: boolean = false;
  bannerImagePreview: string = '';
  searchCtrl = new FormControl('');
  destinationList: any = [];
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  bannerImage: string = '';
  blogImage: string = '';
  uploadedImages: any = [];
  selectedBlogImg: any[] = [];

  constructor(private _formBuilder: FormBuilder, private masterService: MasterService, private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private validationService: ValidationService, private clipboard: Clipboard) {
      this.blogForm = this.createBlogForm();
    }
  

  ngOnInit(): void {
    this.loadDestinations();
    this.activatedRoute.paramMap.subscribe((params) => {
      let blog_id = params.get('blog_id');
      if(blog_id!=null && blog_id!=undefined){
        this.breadscrums = [
        {
          title: 'Edit Blog',
          items: ['Home'],
          active: 'Edit Blog',
        },
      ];
        this.blogId = blog_id;
        this.getBlogDetails(blog_id);
      }
    });
    this.editor = new Editor();    
  }

  getBlogDetails(blogId:string)
  {
    this.uploadedImages=[];
    this.masterService.getBlogDetails(blogId).subscribe((resp:any)=>{
      if(resp.data){
        this.blogData = resp.data;
        this.blogForm.patchValue({
          id: this.blogData.id,
          destination_id: this.blogData.destination?.id,
          title: this.blogData.title,
          content: this.blogData.content,          
          meta_title: this.blogData.meta_title,
          meta_description: this.blogData.meta_description,
          meta_keywords: this.blogData.meta_keywords,
          meta_tags: this.blogData.meta_tags,          
        });
        //this.imagePreviews = resp.data.images[0].file_path;
        resp.data.images.map((item:any)=>{
          if(item?.image_type=='Banner'){
            this.bannerImagePreview=item.file_path;
          }
          if(item?.image_type=='Editor'){
            this.uploadedImages.push(item.file_path);
          }
          if(item?.image_type=='Main'){
            this.imagePreviews=item.file_path;
          }
        })
      }
    })
  }

  loadDestinations() {
      this.masterService.getAllDestinationList().subscribe({
        next: (res: any) => {
          this.destinationList = res.data;      
          this.filteredDestinations$.next(res.data);
          this.searchCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(search => {
            if (!search) {
              this.filteredDestinations$.next(this.destinationList.slice());
              return;
            }
            
            // Filter the destinations
            const searchStr = search.toLowerCase();
            const filtered = this.destinationList.filter((destination: { name: string; }) => 
              destination.name.toLowerCase().includes(searchStr)
            );
            this.filteredDestinations$.next(filtered);
          });  
        }
      });
    }

  onFileChangeBanner(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const result = this.validationService.validateImageFile(file);
      if (!result.isValid) {
        this.toastr.error(result.message);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bannerImagePreview=e.target.result;
      };
      reader.readAsDataURL(file);
      this.blogForm.patchValue({
        banner_image: file
      });
    }
  }
  
  uploadBlogImages(event:any)
  {    
    this.selectedBlogImg = [];
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const result = this.validationService.validateImageFile(file);
        if (!result.isValid) {
          this.toastr.error(result.message);
          return;
        }
        this.selectedBlogImg.push(file);
      }

      this.saveBlogImages();
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = [];
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const result = this.validationService.validateImageFile(file);
        if (!result.isValid) {
          this.toastr.error(result.message);
          return;
        }
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          this.imagePreviews='';
          this.selectedFiles.splice(0, 1);
          if(this.blogData?.images?.length>0){
            this.masterService.deleteBlogImage(this.blogData?.images[0].id).subscribe((resp:any)=>{
              
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
      
    }

    copyImagePath(image_path:string)
    {
      this.clipboard.copy(image_path);
      this.toastr.success('Image path copied successfully');
    }

    onTitleChange() {
      const titleControl = this.blogForm.get('title');
      const metaTitleControl = this.blogForm.get('meta_title');
      
      // Only update meta title if it's empty or hasn't been manually edited
      if (titleControl && metaTitleControl && 
          (!metaTitleControl.value || metaTitleControl.pristine)) {
        metaTitleControl.setValue(titleControl.value);
      }
    }

  async addImageTag(): Promise<void> {
      try {
        const result = await Swal.fire({
          input: "text",
          inputLabel: "Image Alt Tag",
          inputPlaceholder: "Enter image alt tag",
          showCancelButton: true,
          inputValue: this.blogData?.images[0]?.image_alt || '',
          inputValidator: (value) => {
            if (!value) {
              return 'Please enter an alt tag!';
            }
            return null;
          }
        });
    
        if (result.isConfirmed && result.value) {
          // Make API call to update the alt text
          this.masterService.updateBlogImageAlt({'image_id':this.blogData?.images[0].id, 'image_alt':result.value}).subscribe((resp)=>{
            this.getBlogDetails(this.blogId);
            // Show success message
            Swal.fire({
              title: 'Success',
              text: `Alt tag successfully updated to: ${result.value}`,
              icon: 'success'
            });
          });
        }
      } catch (error:any) {
        console.error('Error adding image tag:', error);
        await Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to update image alt tag',
          icon: 'error'
        });
      }
    }

  createBlogForm() {
      return this._formBuilder.group({
        id: [''],
        destination_id:  [''],
        title: ['', [Validators.required]],
        content: ['', Validators.required],
        meta_title: ['', Validators.required],
        meta_description: [''],
        meta_keywords: [''],
        meta_tags: [''],
        uploaded_files: [''],
        banner_image: ['']
      });
    }

    saveBlogForm()
    {
      
      if(this.blogForm.invalid){
        this.toastr.error('Please fill all required fields');
        return;
      }
      // if(this.blogForm.value.content==""){
      //   this.toastr.error('Please fill content field');
      //   return;
      // }      
      this.isLoading=true;
      // if(this.selectedFiles.length>0){
      //   this.blogForm.controls['uploaded_files'].setValue(this.selectedFiles);  
      // }
      
      this.masterService.saveBlogInfo(this.blogForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
        if(resp.message){
          this.isLoading=false;
          this.toastr.success(resp.message);
          this.router.navigate(['/blog']);
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error.error.detail);
      });
    }

    saveBlogImages()
    {
      let selectedFiles = this.selectedBlogImg;
      if(this.blogForm.invalid){
        this.toastr.error('Please fill all required fields');
        return;
      }
      this.isLoading=true;
      if(!this.blogForm.getRawValue().id){
        this.masterService.saveBlogInfo(this.blogForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
          if(resp.message){
            this.isLoading=false;
            this.blogForm.patchValue({
              id:resp?.data?.id
            });
            const formData = new FormData();
            formData.append('blog_id', resp?.data?.id);
            selectedFiles.forEach((file, index) => {
              formData.append('uploaded_files', file);
            });
            this.masterService.uploadDEditorImage(formData).subscribe((resp:any)=>{
              this.toastr.success(resp.message);
              this.isLoading=false;
              this.getBlogDetails(this.blogForm.getRawValue().id);
            })
          }
        });
      }
      else{
        const formData = new FormData();
        formData.append('blog_id', this.blogForm.getRawValue().id);
        selectedFiles.forEach((file, index) => {
          formData.append('uploaded_files', file);
        });
        this.masterService.uploadDEditorImage(formData).subscribe((resp:any)=>{
          this.toastr.success(resp.message);
          this.isLoading=false;
          this.getBlogDetails(this.blogForm.getRawValue().id);
        })
      }
      
    }
}
