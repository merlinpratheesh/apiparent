import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateProjectComponent } from './private-project.component';

describe('PrivateProjectComponent', () => {
  let component: PrivateProjectComponent;
  let fixture: ComponentFixture<PrivateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
