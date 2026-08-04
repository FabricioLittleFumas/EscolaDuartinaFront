import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEntrar } from './modal-entrar';

describe('ModalEntrar', () => {
  let component: ModalEntrar;
  let fixture: ComponentFixture<ModalEntrar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEntrar],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEntrar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
