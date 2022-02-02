import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { StudentService } from '../student.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder ,FormArray} from '@angular/forms';
import * as moment from 'moment';
import { interval, fromEvent } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-testing-engine',
  templateUrl: './testing-engine.component.html',
  styleUrls: ['./testing-engine.component.scss']
})
export class TestingEngineComponent implements OnInit {
  dataTest;
  time;
  moment = moment;
  selected = null;
  form = new FormControl('primary');
  second = 600;
  cssTime;
  cssTimeText;
  testData;
  topBarData;
  candidateData;
  courseData;
  lastestData;
  formArray;
  alertStatus = false;
  arrayEvent =[0,30,60];
  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private router: Router,
    private HttpClient: HttpClient,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private location: Location,
    private elementRef: ElementRef
    ) {
      this.formArray = this.fb.group({
        questions: this.fb.array([])
      });
      this.cssTime = 'lightGreenBackground';
      this.cssTimeText = '';
      this.route.paramMap.subscribe(params => {
        this.studentService.getTest(+params.get('id')).subscribe(result => {
          this.dataTest = result;
          // this.stampVariabe = this.dataTest.left_time;
          this.studentService.getTestData(this.dataTest.test_id).subscribe(data => {
            this.lastestData = result;
            this.testData = data;
            var checkDate = this.studentService.dateCheck(this.testData.from_date,this.testData.to_date,this.testData.from_time,this.testData.to_time);
              if(checkDate == false){
                this.router.navigate([""]);
              }else{
                this.studentService.checkStatus(this.testData.test_status_id,this.testData.test_status_name);
                this.studentService.getGlobalCandidate(this.testData.citizen_id).subscribe(result3 => {
                  this.candidateData = result3[0];
                  this.topBarData = [this.candidateData.candidate_name_en, this.candidateData.candidate_img_base64];
                  // console.log(this.testData);
                  
                  this.studentService.getGlobalCourse(this.testData.course_code).subscribe(ress =>{
                    var resultSec;
                    if(this.testData.last_update_time !=null){
                      resultSec =this.studentService.timeToSecContinue(this.testData.start_time,this.testData.last_update_time)
                    }else{
                      resultSec =this.studentService.timeToSec(this.testData.start_time,1)
                    }
                    this.courseData = ress[0];
                    // console.log(this.courseData.test_time);/
                    var leftTimeToSec = this.courseData.test_time*60;
                    var hTomin = resultSec.hour*60;
                    var summin = resultSec.minute + hTomin;
                    var minTosec = summin*60;
                    var lastSum = minTosec + resultSec.second;
                    this.second = this.dataTest.left_time;
                    // console.log(this.second);
                    // this.second = leftTimeToSec - lastSum;
                    var event = this.second;
                    var stampEvent =90;
                    while(event>=0){
                      this.arrayEvent.push(stampEvent);
                      event-=30;
                      stampEvent+=30;
                    }
                    this.selected = this.dataTest.question.selected_choice;
                    // console.log(this.dataTest.question.selected_choice);
                    if(this.second <= 60){
                      this.cssTime = "orangeBackground";
                      this.cssTimeText = "redFont";
                    }
                    if(this.second <= 0 ){
                      if(this.alertStatus==false){
                        this.alertStatus = true;
                        this.openDialog('timeOut');
                        setTimeout( () => {
                          this.router.navigate(["/result",this.dataTest.test_id]);
                        }, 2000);
                      }
                    }
                    this.createQuestionMatch(this.dataTest);
                    // console.log(this,this.dataTest);
                  });
                 
                  },
                );
              }
            
            },
          );
          },error=>{
            this.dataTest = false;
          }
        )
      });
     
  }

  ngOnInit(): void {
    interval(30000).subscribe(time => this.studentService.StampTime(this.testData));
  }
  createSubForm(data){
    var subForm = this.fb.group({
      test_question_match_id: null,
      test_question_id: null,
      question_match_id: null,
      question_match_no: null,
      question_name: null,
      correct_choice_id: null,
      selected_choice_id: null,
      is_correct: null,
    });
    if(data!=null){
      subForm.patchValue(data);
    }
    // console.log(this.formArray.get('questions').value);
    return subForm;
  }
  zoomIMG(data){
    var result = this.studentService.extractSrc(data);

    if(result.length>0){
      const dialogRef = this.dialog.open(DialogComponent, {
        maxWidth: '1000px',
        data: {
          type: 'zoom',
          IMGS: result,
        }
      });
    }
  }
  createQuestionMatch(dataTest){
    let form = this.formArray.get('questions') as FormArray;
    (this.formArray.get('questions') as FormArray).clear();
    dataTest.question.question_matches.forEach(element => {
      form.push(this.createSubForm(element))
    });
    // console.log(form.value);
    this.cdRef.detectChanges()
  }
  openDialog(type){
    var checkQuestion =true;
    
    if (this.selected != null || this.dataTest.question.is_match == true){
      if(this.dataTest.question.is_match==false){
        this.dataTest.question.selected_choice = this.selected;
      }else{
        this.dataTest.question.question_matches = this.formArray.get('questions').value;
      }
      this.studentService.gotoQuestion(this.dataTest,this.dataTest.question.question_no).subscribe(result=>{
        // this.selected = null;
        this.dataTest = result;
        this.lastestData = result;
        this.lastestData.questions.forEach(question => {
          if(question.is_answer == false || question.is_answer ==null){
            checkQuestion=false;
            // console.log(question.is_answer);
          }
        });
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '400px',
          data: {
            type: type,
            success: checkQuestion,
            question_no: this.dataTest.test_id
          }
        });
      });
    }else{
      this.lastestData.questions.forEach(question => {
        if(question.is_answer == false || question.is_answer ==null){
          checkQuestion=false;
        }
      });
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '400px',
        data: {
          type: type,
          success: checkQuestion,
          question_no: this.dataTest.test_id
        }
      });
    }
    
  }
  action(action,questionNo=1){
    if(this.dataTest.question.is_match == true){
      this.dataTest.question.question_matches = this.formArray.get('questions').value;
    }
    if (this.selected != null){
      this.dataTest.question.selected_choice = this.selected;
    }
    if (action =='goto'){
      this.studentService.gotoQuestion(this.dataTest,questionNo).subscribe(result=>{
        this.dataTest = result;
        this.lastestData = result;
        this.createQuestionMatch(this.dataTest);
        },
      );
    }else{
      this.studentService.skip(this.dataTest,action).subscribe(result=>{
        this.dataTest = result;
        this.lastestData = result;
        this.createQuestionMatch(this.dataTest);
        },
      );
    }
    // console.log(this.dataTest);
    this.cdRef.detectChanges()
    this.selected =null;
    this.route.paramMap.subscribe(params => {
      this.studentService.getTestData(+params.get('id')).subscribe(result => {
        // console.log(result);
        this.testData = result
        this.lastestData = result;
        // this.createQuestionMatch(this.dataTest);
        this.studentService.checkStatus(this.testData.test_status_id,this.testData.test_status_name);
      })
    })
  }
  handleEvent($event) {
    if (this.selected != null){
      this.dataTest.question.selected_choice = this.selected;
      this.studentService.gotoQuestion(this.dataTest,1).subscribe(result=>{
        this.selected =null
      });
    }
    if ($event.left === 0) {
      if(this.alertStatus == false){
        this.openDialog('timeOut');
        setTimeout( () => {
          this.router.navigate(["/result",this.dataTest.test_id]);
        }, 2000);
      }
      
    }else if($event.left == 60000){
        this.cssTime = "orangeBackground";
        this.cssTimeText = "redFont";
    }else{

    }
  }
  back(){
    this.location.back();
  }
}
