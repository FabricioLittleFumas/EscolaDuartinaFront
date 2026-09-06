import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditAluno } from './modal-edit-aluno';

describe('ModalEditAluno', () => {
  let component: ModalEditAluno;
  let fixture: ComponentFixture<ModalEditAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
