import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalInsertAluno } from './modal-insert-aluno';

describe('ModalInsertAluno', () => {
  let component: ModalInsertAluno;
  let fixture: ComponentFixture<ModalInsertAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInsertAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
