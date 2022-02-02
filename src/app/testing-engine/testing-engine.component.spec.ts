import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingEngineComponent } from './testing-engine.component';

describe('TestingEngineComponent', () => {
  let component: TestingEngineComponent;
  let fixture: ComponentFixture<TestingEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
