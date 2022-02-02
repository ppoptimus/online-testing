import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  img_index=0;
  constructor( 
    private router:Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // console.log(data.IMGS);
     }

  ngOnInit(): void {
  }
  nextImg(){
    // console.log(this.img_index);
    this.img_index++;
  }
  previousImg(){
    // console.log(this.img_index);
    this.img_index--;
  }
  close(){
    this.dialogRef.close();
  }
  confirm(id){
    this.dialogRef.close();
    setTimeout( () => {
      this.router.navigate(["result",id]);
    }, 1000);
  }

}
