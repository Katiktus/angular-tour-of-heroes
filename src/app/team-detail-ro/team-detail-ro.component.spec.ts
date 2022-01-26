import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDetailRoComponent } from './team-detail-ro.component';

describe('TeamDetailRoComponent', () => {
  let component: TeamDetailRoComponent;
  let fixture: ComponentFixture<TeamDetailRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamDetailRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDetailRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
