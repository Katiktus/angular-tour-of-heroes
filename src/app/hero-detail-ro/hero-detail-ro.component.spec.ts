import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailRoComponent } from './hero-detail-ro.component';

describe('HeroDetailRoComponent', () => {
  let component: HeroDetailRoComponent;
  let fixture: ComponentFixture<HeroDetailRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroDetailRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
