import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  formID;
  constructor( private form: FormBuilder,) { 
    this.formID = form.group({
      numberID: ['', Validators.required, Validators.minLength(13),Validators.maxLength(13)],
    });
  }
  ngOnInit(): void {
  }
}
