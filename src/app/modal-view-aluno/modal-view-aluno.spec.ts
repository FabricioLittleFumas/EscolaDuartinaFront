import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalViewAluno } from './modal-view-aluno';

describe('ModalViewAluno', () => {
  let component: ModalViewAluno;
  let fixture: ComponentFixture<ModalViewAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalViewAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
