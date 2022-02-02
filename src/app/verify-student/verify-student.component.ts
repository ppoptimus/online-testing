import { Component, OnInit, ViewChild, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Observable , Observer} from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatHorizontalStepper, MatStep, MatVerticalStepper } from '@angular/material/stepper';
import { StudentService } from '../student.service';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';

@Component({
  selector: 'app-verify-student',
  templateUrl: './verify-student.component.html',
  styleUrls: ['./verify-student.component.scss']
})
export class VerifyStudentComponent implements OnInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('stepperMobile') stepperMobile: MatHorizontalStepper;
  formID;
  webcamImage;
  img='loading';
  module='camera';
  ID;
  charactor;
  imgFile;
  candidateData;
  dataTest;
  moment;
  resultUpload;
  infos;
  testID;
  display = false;
  count =0;
  private trigger: Subject<void> = new Subject<void>();
  constructor(
    private form: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private studentService: StudentService,
    private cdRef: ChangeDetectorRef,
    ) {
    this.formID = form.group({
      numberID: [''],
      numberMobileID: [''],
    });
  }
  ngOnInit(): void {
  }
  saveID(type){
    if(type == 'mobile'){
      this.ID=this.formID.get('numberMobileID').value;
    }else{
      this.ID=this.formID.get('numberID').value;
    }
    // this.stepper.next();
    if(this.ID.length>0){
      if(this.isnumber(this.ID)){
        this.charactor=this.ID.length;
        if(this.charactor==13){
          this.studentService.validateID(this.ID).subscribe(result=>{
            this.candidateData = result;
            this.studentService.getStudent(this.candidateData.candidate_id).subscribe(status=>{
              this.dataTest = status;
              // this.stepper.next();
              this.studentService.getInformation(this.candidateData.candidate_id).subscribe(r =>{
                this.infos = r;
                if(this.infos.length <= 1){
                  this.checkStudent(type,this.dataTest.test)
                }else{
                  this.infos.forEach(element => {
                    if(element.test.test_status_id == 1 || element.test.test_status_id == 3){
                      this.count++;
                    }else{
                      this.testID = element.test.test_id;
                    }
                  });
                  if(this.infos.length-this.count > 1){
                    this.display = true;
                  }
                  if(this.infos == this.count){
                    this.openSnackBar('สอบเสร็จแล้ว')
                  }else{
                    if(type == 'mobile'){
                      this.stepperMobile.next();
                    }else{
                      this.stepper.next();
                    }
                  }
                }
              });
            });
          },error=>{
            this.formID.get('numberID').markAllAsTouched();
            this.openSnackBar('ไม่พบข้อมูลในระบบ')
          });
        }else{
          this.openSnackBar()
        }
      }else{
        this.openSnackBar('กรุณากรอกเฉพาะตัวเลข')
      }
    }else{
      this.openSnackBar()
    }
    this.cdRef.detectChanges();
  }
  isnumber(s){
    var x = +s; 
    if(x.toString().length<13){
      var len = 13-x.toString().length;
      var resetString = x.toString();
      while(len>0){
        resetString = "0"+ resetString;
        len--;
      }
      return resetString === s;
    }else{
      return x.toString() === s;
    }
    
  }
  handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  
  }
  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  triggerSnapshot(): void {
    this.trigger.next();
    this.module='capture';
    
  }
  checkStudent(type,test){
    if(test !=null){
      if(test.test_status_id!= 3 && test.test_status_id!= -1){
        if(test.is_lock == false){
          if(type == 'mobile'){
            this.stepperMobile.next();
          }else{
            this.stepper.next();
          }
        }else{
          this.openSnackBar('รอเจ้าหน้าที่อนุญาติ');
        }
      }else{
        this.openSnackBar(this.dataTest.test.test_status_name);
      }
    }else{
      this.openSnackBar('กรุณาติดต่อเจ้าหน้าที่');
    }
  }
  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }
  newSnapshot(){
    this.module='camera';
  }
  loadingSuccess(){
    this.studentService.getStudent(this.candidateData.candidate_id).subscribe(result=>{
      var file = new File([this.dataURItoBlob(this.webcamImage.imageAsDataUrl)], moment().tz('Asia/Bangkok').format('yyyy-MM-DD_HH:mm:ss') + "-" + this.ID + ".png");
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.studentService.upload1(formData).subscribe(result=>{
        this.resultUpload = result
        if(this.resultUpload.status == "success"){
          this.candidateData.candidate_img_base64 = this.resultUpload.message[0].file_name;
          this.studentService.updateImgBase64(this.candidateData).subscribe(student=>{
          });
        }
      });
    });
    setTimeout( () => {
      this.img='checked'; 
      if(this.infos.length ==1 ){
        setTimeout( () => {
          this.router.navigate(["/profile/"+this.candidateData.candidate_id+"/"+this.dataTest.test.test_id]);
        }, 2000);
      }else if(this.infos.length-this.count == 1){
        setTimeout( () => {
          this.router.navigate(["/profile/"+this.candidateData.candidate_id+"/"+this.testID]);
        }, 2000);
      }
      
    }, 3000);  
     
  }
  openSnackBar(message="กรุณากรอกเลขบัตรประชาชน 13 หลัก",display='failSnack'){
    this.snackBar.open(message, 'close', {
      duration: 2000,
      panelClass: [display]
    });
  }
  dataURItoBlob(dataURI) {
    var b64Data = dataURI.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');
    const byteString = atob(b64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

  reloadID(){
    this.openSnackBar('ระบบกำลังโหลดข้อมูล..','whiteBackground');
    this.studentService.getCardID().subscribe(result =>{
      this.openSnackBar('โหลดข้อมูลเรียบร้อย','successSnack');
      // this.formID.get('numberID').setValue(result);
    },error =>{
      this.openSnackBar('กรุณาเสียบบัตรประชาชน');
    });
  }
  

}
