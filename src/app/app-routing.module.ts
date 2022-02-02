import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { VerifyStudentComponent } from './verify-student/verify-student.component';
import { IndexComponent } from './index/index.component';
import { TestingEngineComponent } from './testing-engine/testing-engine.component';
import { ResultComponent } from './result/result.component';


const routes: Routes = [
  { path : '' , component : IndexComponent},
  { path : 'verify' , component : VerifyStudentComponent},
  { path : 'profile/:id/:test' , component : ProfileComponent},
  { path : 'test-engine/:id' , component : TestingEngineComponent},
  { path : 'result/:id' , component : ResultComponent},
  // { path : 'result' , component : ResultComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
