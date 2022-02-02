import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CountdownModule } from 'ngx-countdown';
import { VerifyStudentComponent } from './verify-student/verify-student.component';
import { ProfileComponent } from './profile/profile.component';
import { TestingEngineComponent } from './testing-engine/testing-engine.component';
import { MaterialModule } from './material.module';
import { IndexComponent } from './index/index.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { ResultComponent } from './result/result.component';
import { DialogComponent } from './dialog/dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';
registerLocaleData(localeTh, 'th');
// import { Base64IMGModule } from 'base64-img';

@NgModule({
  declarations: [
    AppComponent,
    VerifyStudentComponent,
    ProfileComponent,
    TestingEngineComponent,
    IndexComponent,
    TopBarComponent,
    ResultComponent,
    DialogComponent,
    DialogAlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CountdownModule,
    HttpClientModule,
    WebcamModule,
    FormsModule,
    // Base64IMGModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'th-TH' }],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
