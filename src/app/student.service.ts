import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import { map, filter, catchError } from "rxjs/operators";
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // host='https://etesting-api.71dev.com/api/';
  host='https://e-testing.dsd.go.th/api/';
  // host= window.location.origin +'/api/';
  moment = moment;
  momentTZ = momentTZ;
  constructor(
    private httpClient:HttpClient,
    private dialog:MatDialog,
    private router: Router,
    ) {
      // console.log(this.host);
     }
    // upload1(target) {
    //   return this.httpClient.post('https://e-testing.dsd.go.th/api/upload', target);
    // }
    upload1<HttpHeaderResponse>(target: FormData) {
    return this.httpClient
      .post('https://e-testing.dsd.go.th/api/upload', target, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: 'progress', message: `${progress}` };
            case HttpEventType.Response:
              return { status: 'success', message: event.body };
            default:
              return `Unhandled event: ${event.type}`;
          }
        }),
        catchError((err) => {
          return of({ status: 'error', message: `${err.message}` });
        })
      );
  }
  getCardID(){
    return this.httpClient.get('http://127.0.0.1:31313/get');
  }
  getTest(id){
    return this.httpClient.get(this.host+'tests/'+id+'/start');
  }
  getTestData(id){
    return this.httpClient.get(this.host+'tests/'+id);
  }
  updateTest(id,data){
    return this.httpClient.put(this.host+'tests/'+id,data);
  }
  getResult(){
    return this.httpClient.get(this.host+'invigilator/examinees/get');
  }
  getStudent(id){
    return this.httpClient.get(this.host+'tests/information/'+id);
  }
  getInformation(id){
    return this.httpClient.get(this.host+'tests/informations/'+id);
  }
  getCandidate(id){
    // console.log(id)
    return this.httpClient.get(this.host+'candidates/'+id);
  }
  getGlobalCandidate(citizen){
    // console.log(id)
    return this.httpClient.get(this.host+'candidates?citizen_id='+citizen);
  }
  getCourse(id){
    // console.log(id)
    return this.httpClient.get(this.host+'courses/'+id);
  }
  getGlobalCourse(id){
    // console.log(id)
    return this.httpClient.get(this.host+'courses?course_code='+id);
  }
  statusCheck(id){
    // console.log(id)
    return this.httpClient.get(this.host+'tests?candidate_id=' + id);
  }
  validateID(id){
    return this.httpClient.get(this.host+'candidates/validate/'+id);
  }
  validateUploadIMG(img){
    return this.httpClient.post(this.host+'upload',img,({ observe: 'response' }));
  }
  updateImgBase64(data){
    return this.httpClient.put(this.host+'candidates/'+data.candidate_id,data);
  }
  updateLogin(data){
    return this.httpClient.put(this.host+'tests/'+data.test_id,data);
  }
  StampTime(data){
    return this.httpClient.put(this.host+'tests/'+data.test_id+'/keepalive',data);
  }
  gotoQuestion(dataTest,questionNo){
    return this.httpClient.post(this.host+'tests/'+dataTest.test_id+'/goto/'+questionNo,dataTest);
  }
  skip(dataTest,action='end'){
    // console.log();
    return this.httpClient.post(this.host+'tests/'+dataTest.test_id+'/'+action,dataTest);
  }
  checkStatus(status,statusName){
    // console.log(status + statusName);
    if(status == 3 || status == -1){
      const dialogRef = this.dialog.open(DialogAlertComponent, {
        width: '400px',
        // data:'confirm ?'
        data: {status_name: statusName}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate([""]);
      });
    }
  }
  dateNow(date=null){
    if(date == null){
      date = new Date().toJSON("yyyy/MM/dd HH:mm UTC")
    }
    var dateTokens = date.split('T');
    var dates = dateTokens[0].split('-');
    var timeTokens = dateTokens[1].split('.');
    var time = timeTokens[0].split(':');
    return {date: dates,time : time};
  }
  dateCheck(from_date,to_date,from_time,to_time){
    var timeCheck = this.compareTime(from_time,to_time);
    if(moment().tz('Asia/Bangkok').diff(from_date, 'days') >= 0  && moment().tz('Asia/Bangkok').diff(to_date, 'days') <= 0 && timeCheck == true){
      return true
    }else{
      return false;
    }
  }
  compareTime(from_time,to_time){
    var Now = moment().tz('Asia/Bangkok').format('HH:mm:ss');
    var start_time = this.createTime( from_time.split(':'));
    var now_time = this.createTime(Now.split(':'));
    var time_end = this.createTime( to_time.split(':'));
    if(start_time<=now_time && now_time<=time_end){
      return true;
    }else{
      return false;
    }
  }
  createTime(time){
    return new Date(2020,1,1,
      Number(time[0]),
      Number(time[1]),
      Number(time[2])
      );
  }
  timeToSec(endTime ,type ){
    
    var firstSplit = endTime.split('T');
    var secondSplit = firstSplit[1].split('.');
    var end_time = secondSplit[0].split(':');
    var endTimes = new Date(
      Number(moment().tz('Asia/Bangkok').format('YYYY')),
      Number(moment().tz('Asia/Bangkok').format('MM')),
      Number(moment().tz('Asia/Bangkok').format('DD')),
      Number(end_time[0]),
      Number(end_time[1]),
      Number(end_time[2]),
      );
    var nowTimes = new Date(
      Number(moment().tz('Asia/Bangkok').format('YYYY')),
      Number(moment().tz('Asia/Bangkok').format('MM')),
      Number(moment().tz('Asia/Bangkok').format('DD')),
      Number(moment().tz('Asia/Bangkok').format('HH')),
      Number(moment().tz('Asia/Bangkok').format('mm')),
      Number(moment().tz('Asia/Bangkok').format('ss')),
      );
      var time_end = endTimes;
      var time_now = nowTimes;
    let diff = time_end.getTime() - time_now.getTime();
    if(type == 1){
      diff = time_now.getTime() - time_end.getTime();
    }
   
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    let minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    let seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }
  timeToSecContinue(startTime ,lastTime ){
    var firstSplit = startTime.split('T');
    var secondSplit = firstSplit[1].split('.');
    var end_time = secondSplit[0].split(':');

    var firstSplit2 = lastTime.split('T');
    var secondSplit2 = firstSplit2[1].split('.');
    var last_time = secondSplit2[0].split(':');
    
    var endTimes = new Date(
      Number(moment().tz('Asia/Bangkok').format('YYYY')),
      Number(moment().tz('Asia/Bangkok').format('MM')),
      Number(moment().tz('Asia/Bangkok').format('DD')),
      Number(end_time[0]),
      Number(end_time[1]),
      Number(end_time[2]),
      );
    var lastTimes = new Date(
      Number(moment().tz('Asia/Bangkok').format('YYYY')),
      Number(moment().tz('Asia/Bangkok').format('MM')),
      Number(moment().tz('Asia/Bangkok').format('DD')),
      Number(last_time[0]),
      Number(last_time[1]),
      Number(last_time[2]),
      );
    let diff =  lastTimes.getTime() - endTimes.getTime();
   
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    let minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    let seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }
  extractSrc(data){
    var dataSplit = data.split('<img');
    var dataSPlit2 = dataSplit.split('>');
    var newData = "<img" + dataSPlit2[0] + ">";
    console.log(newData);
    var m,
    urls = [], 
    // str = '<img src="http://site.org/one.jpg />\n <img src="http://site.org/two.jpg />',
    rex = /<img[^>]+src="?([^"\s]+)"?"[^>]+alt=""?"\s*\/>/g;
    // rex2 = /<img[^>]+src="?([^"\s]+)"?"[^>]+alt=""?"[^>]+width="?([0-9]+)"?"[^>]+height="?([0-9]+)"?"\s*\/>/g;

    while ( m = rex.exec( newData ) ) {
        urls.push( m[1] );
    }
    rex = /<img[^>]+src="?([^"\s]+)"?"[^>]+alt=""?"[^>]+width="?([0-9]+)"?"[^>]+height="?([0-9]+)"?"\s*\/>/g;

    while ( m = rex.exec( newData ) ) {
        urls.push( m[1] );
    }
    return urls;
  }
}


