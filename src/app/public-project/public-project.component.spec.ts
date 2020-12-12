import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProjectComponent } from './public-project.component';

describe('PublicProjectComponent', () => {
  let component: PublicProjectComponent;
  let fixture: ComponentFixture<PublicProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
