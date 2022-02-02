import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  student;
  moment = moment;
  btnStatus = false;
  updateData;
  infos;
  constructor( 
    private dialog:MatDialog,
    private studentService:StudentService,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef,
    private router:Router
    
    ) {
      this.route.paramMap.subscribe(params=>{
        this.studentService.getInformation(+params.get('id')).subscribe(result=>{
          this.infos = result;
          this.infos.forEach(element => {
            if(element.test.test_id == +params.get('test')){
              this.student = element;
            }
          });
          if(this.student.test.test_status_id == 2){
            if(this.studentService.dateCheck(this.student.test.from_date,this.student.test.to_date,this.student.test.from_time,this.student.test.to_time)){
              if(this.student.test.is_login == false){
                this.btnStatus = true;
                this.change.detectChanges();
              }else{
                this.openDialog("noLogin");
              }
            }else{
              this.openDialog("dateCheck");
            }
          }
          // if(this.studentService.dateCheck(this.student.test.from_date,this.student.test.to_date,this.student.test.from_time,this.student.test.to_time)){
          //   if(this.student.test.is_login == false){
          //     this.btnStatus = true;
          //     this.change.detectChanges();
          //   }
          // }
          // this.studentService.checkStatus(this.student.test.test_status_id,this.student.test.test_status_name);
        });
      });
     }
  // student;
  ngOnInit(): void {
   
  }
  openDialog(action){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      // data:'confirm ?'
      data: {type: action}
    });
  }
}
