import { Injectable } from '@angular/core';
import { BaseService } from '../base/base-services';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemoService extends BaseService {
    /*
        สมมุติว่า ชื่อ โดเมนเต็ม คือ https://e-testing.dsd.go.th/a/question_bank/questions
        ให้เราใส่ /question_bank/questions เข้าในpameter ของ super ช่องแรก
    */
  constructor(
    public http: HttpClient  // ต้อง inject http เข้ามาเพื่อใช้เรียก servies ใน BaseService
  ) { 
    super('/question_bank/questions',http)
  }
}
