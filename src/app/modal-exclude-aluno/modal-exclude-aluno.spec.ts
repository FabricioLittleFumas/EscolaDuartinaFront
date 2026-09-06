import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalExcludeAluno } from './modal-exclude-aluno';

describe('ModalExcludeAluno', () => {
  let component: ModalExcludeAluno;
  let fixture: ComponentFixture<ModalExcludeAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExcludeAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalExcludeAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
