import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  studentTestData;
  testData;
  test;
  candidate;
  course;
  moment = moment;
  constructor(
    private studentService:StudentService,
    private route: ActivatedRoute,) {
   }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params=>{
      this.studentService.getTest(+params.get('id')).subscribe(result=>{
        this.testData = result;
        this.studentService.skip(result).subscribe(data=>{
          this.studentTestData = data;
          // console.log(this.studentTestData);
          this.studentService.getTestData(this.testData.test_id).subscribe(test=>{
            this.test=test;
            this.studentService.getGlobalCourse(this.test.course_code).subscribe(course=>{
              this.course = course[0];
              // console.log(this.course);
              this.studentService.getGlobalCandidate(this.test.citizen_id).subscribe(result3=>{
                this.candidate = result3[0];
              },
            );
            })
            
            },
          );
          },
        );
        },
      );
    });
  }

}
