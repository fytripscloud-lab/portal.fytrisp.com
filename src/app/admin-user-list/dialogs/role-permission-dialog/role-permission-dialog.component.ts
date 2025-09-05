import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';

@Component({
  selector: 'app-role-permission-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent],
  templateUrl: './role-permission-dialog.component.html',
  styleUrl: './role-permission-dialog.component.scss'
})
export class RolePermissionDialogComponent {

  dialogTitle: string;
  userId: any;
  menuLists: any = [];
  selectedIds: number[] = [];
  menuId: string = '';
  permissions: {
    id?: string;
    user_id: string;
    menu_id: string;
    can_view: boolean;
  }[] = [];

  constructor(
    public dialogRef: MatDialogRef<RolePermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService
  ) {
    
    this.dialogTitle = 'Role Permission';
    this.userId = data?.user_id;
    this.menuLists = data?.menu_lists;
    if(this.userId){
      this.getRolePermission(this.userId);
    }
    // if (data?.permissions) {
    //   this.permissions = data.permissions;
    // } else {
    //   this.initializePermissions();
    // }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleCheckbox(event: any) {
    if (event.target.type !== 'checkbox') {
      const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    }
  }

  onCheckboxChange(event: any, menuId: string) {
    const isChecked = event.target.checked;
    
    // Find if permission already exists
    const existingIndex = this.permissions.findIndex(
      p => p.user_id === this.userId && p.menu_id === menuId
    );
    
    if (existingIndex === -1) {
      // Add new permission if it doesn't exist
      const newPermission = {
        user_id: this.userId,
        menu_id: menuId,
        can_view: isChecked
      };
      this.permissions.push(newPermission);
    } else {
      // Update existing permission
      this.permissions[existingIndex].can_view = isChecked;
    }
  }
  
  getRolePermission(userId:string){
    this.masterService.getRolePermissionListByUser(userId).subscribe((resp:any)=>{
      if(resp?.total_items>0)
      {
        for(let item of resp.data){
          this.permissions.push({            
            user_id: this.userId,
            menu_id: item?.menu?.id,
            can_view: item.can_view
          });
        }        
      }
    })
  }

  saveRolePermission()
  {
    this.masterService.setRolePermission({permissions:this.permissions}).subscribe((rep:any)=>{
      if(rep.message){
        this.dialogRef.close(rep.message);
      }
    })
  }

  hasPermission(menuId: number): boolean {
    return this.permissions.some((permission:any) => permission.menu_id === menuId && permission.can_view);
  }

  private initializePermissions() {
    this.permissions = this.menuLists.map((menu:any) => ({
      user_id: this.userId,
      menu_id: menu.id,
      can_view: false
    }));
  }

  
}
