import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditInfoComponent } from './deck-edit-info.component';

describe('DeckEditInfoComponent', () => {
  let component: DeckEditInfoComponent;
  let fixture: ComponentFixture<DeckEditInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckEditInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
