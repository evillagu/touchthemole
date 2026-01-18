import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from './home';
import { GameStateRepository } from '../../../core/ports/game-state-repository.port';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { listDifficulties } from '../../../application/use-cases/difficulty.use-case';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let mockRepository: jasmine.SpyObj<GameStateRepository>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRepository = jasmine.createSpyObj('GameStateRepository', ['save']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, ReactiveFormsModule],
      providers: [
        { provide: GAME_STATE_REPOSITORY, useValue: mockRepository },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    const validationTestCases = [
      { input: '', isValid: false, description: 'empty string' },
      { input: '   ', isValid: false, description: 'whitespace only' },
      { input: 'Player', isValid: true, description: 'valid name' },
      { input: 'Test Player 123', isValid: true, description: 'name with spaces and numbers' }
    ];

    validationTestCases.forEach(({ input, isValid, description }) => {
      it(`should ${isValid ? 'be valid' : 'be invalid'} for ${description}`, () => {
        component.nameControl.setValue(input);
        fixture.detectChanges();

        expect(component.nameControl.valid).toBe(isValid);
      });
    });

    it('should disable button when form is invalid', () => {
      component.nameControl.setValue('');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.home__button');
      expect(button.disabled).toBe(true);
    });

    it('should enable button when form is valid', () => {
      component.nameControl.setValue('TestPlayer');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.home__button');
      expect(button.disabled).toBe(false);
    });
  });

  describe('start method', () => {
    const startTestCases = [
      { playerName: 'Player1', shouldNavigate: true, description: 'valid player name' },
      { playerName: 'Test Player', shouldNavigate: true, description: 'player name with space' }
    ];

    startTestCases.forEach(({ playerName, shouldNavigate, description }) => {
      it(`should save state and navigate ${description}`, () => {
        component.nameControl.setValue(playerName);
        fixture.detectChanges();

        component.start();

        expect(mockRepository.save).toHaveBeenCalled();
        const savedState = mockRepository.save.calls.mostRecent().args[0];
        expect(savedState.playerName).toBe(playerName);
        expect(savedState.points).toBe(0);

        if (shouldNavigate) {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
        }
      });
    });

    it('should not navigate when form is invalid', () => {
      component.nameControl.setValue('');
      fixture.detectChanges();

      component.start();

      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should trim player name', () => {
      component.nameControl.setValue('  TestPlayer  ');
      fixture.detectChanges();

      component.start();

      const savedState = mockRepository.save.calls.mostRecent().args[0];
      expect(savedState.playerName).toBe('TestPlayer');
    });

    it('should limit player name length', () => {
      const longName = 'A'.repeat(30);
      component.nameControl.setValue(longName);
      fixture.detectChanges();

      component.start();

      const savedState = mockRepository.save.calls.mostRecent().args[0];
      expect(savedState.playerName.length).toBeLessThanOrEqual(24);
    });
  });

  describe('template rendering', () => {
    it('should display title', () => {
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.home__title');
      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toBe('Toca el Topo');
    });

    it('should display input field', () => {
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('.home__input');
      expect(input).toBeTruthy();
      expect(input.getAttribute('type')).toBe('text');
    });

    it('should display label', () => {
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.home__label');
      expect(label).toBeTruthy();
      expect(label.textContent.trim()).toBe('Nombre del jugador');
    });

    it('should display start button', () => {
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.home__button');
      expect(button).toBeTruthy();
      expect(button.textContent.trim()).toBe('Start');
    });

    it('should have i18n attributes', () => {
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.home__title');
      expect(title.getAttribute('i18n')).toBe('@@app.title');

      const label = fixture.nativeElement.querySelector('.home__label');
      expect(label.getAttribute('i18n')).toBe('@@home.playerName.label');

      const button = fixture.nativeElement.querySelector('.home__button');
      expect(button.getAttribute('i18n')).toBe('@@home.start.button');
    });
  });
});