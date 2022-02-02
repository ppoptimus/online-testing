import { HttpClient, HttpEventType } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface IapiResponse<T> {
  apiResponse: {
    id: number;
    desc: string;
  };
  data: Array<T>;
}

export class BaseService {
  /*
        สมมุติว่า ชื่อ โดเมนเต็ม คือ https://e-testing.dsd.go.th/a/question_bank/questions
        เราจะใช้ https://e-testing.dsd.go.th
        แยกไว้เพื่ออาจจะต้องใช้อย่างอื่น
    */
  host: string = 'https://e-testing.dsd.go.th';

  /*
        สมมุติว่า ชื่อ โดเมนเต็ม คือ https://e-testing.dsd.go.th/a/question_bank/questions
        เราจะใส่ prefixต่อท้าย ตัวแปร host ทั้งนี้ทั้งนั้นขึ้นอยู่กับชื่อapi ในที่นี้คือตัว a       
    */
  protected prefix: string = `${this.host}/a`;

  /*
        ตัวแปรนี้ไว้เรียกใช้ที่ฟังชั่นอื่น
    */
  protected fullUrl: string = '';

  constructor(
    endpoint: string, // endpoint url ของแต่ละ service
    protected http: HttpClient // ต้อง inject http เข้ามาเพื่อใช้เรียก servies
  ) {
    this.fullUrl = this.prefix + endpoint;
  }

  callService<T>(action: string, data?: any[]): Observable<IapiResponse<T>> {
    const body = {
      apiRequest: {
        action: action,
      },
      data: data || [],
    };
    return this.http.post<IapiResponse<T>>(this.fullUrl, body);
  }

  /*
        ข้างล่างนี้เป็นฟั่งชั่นไว้รับ uploadFile ของ api ซึ่งมี progress ติดมาด้วย        
    */

  uploadFile<HttpHeaderResponse>(target: FormData) {
    return this.http
      .post(this.fullUrl, target, {
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

  /*
            ข้างล่างนี้เป็นฟั่งชั่นตาม verb ของ api
        */
  getAll<T>(): Observable<T[]> {
    return this.http.get<T[]>(this.fullUrl);
  }

  add<T>(data: T): Observable<T> {
    return this.http.post<T>(this.fullUrl, data);
  }

  get<T>(id: number): Observable<T> {
    return this.http.get<T>(`${this.fullUrl}/${id}`);
  }

  update<T>(id: number, data: T): Observable<Response> {
    return this.http.put<Response>(`${this.fullUrl}/${id}`, data);
  }

  deleteData(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.fullUrl}/${id}`);
  }

  /*
            ข้างล่างนี้เป็นฟั่งชั่นไว้รับ queryString ของ api 
            ex:: https://e-testing.dsd.go.th/a/question_bank/questions/1
            เราใส่ /1 ใน parameter ได้เลย
        */

  query<T>(query: string): Observable<T> {
    return this.http.get<T>(`${this.fullUrl}/${query}`);
  }
}
