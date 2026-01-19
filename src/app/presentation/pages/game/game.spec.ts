import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { GamePageComponent } from './game';
import { GameStateRepository } from '../../../core/ports/game-state-repository.port';
import { GameState } from '../../../core/domain/game-state.model';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';
import {
  listDifficulties,
  resolveDifficulty,
} from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { GameBoardComponent } from '../../components/game-board/game-board';
import { ScoreBoardComponent } from '../../components/score-board/score-board';

const createMockGameState = (playerName: string, points = 0): GameState => {
  const difficulties = listDifficulties();
  const difficulty = resolveDifficulty(difficulties[0].id);
  const state = startGame(playerName, difficulty);
  return { ...state, points };
};

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;
  let mockRepository: jasmine.SpyObj<GameStateRepository>;
  let mockRouter: jasmine.SpyObj<Router>;

  const setupTestBed = async (): Promise<void> => {
    mockRepository = jasmine.createSpyObj('GameStateRepository', [
      'load',
      'save',
      'clear',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [GamePageComponent, GameBoardComponent, ScoreBoardComponent],
      providers: [
        { provide: GAME_STATE_REPOSITORY, useValue: mockRepository },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load game state from repository if available', () => {
      const mockState = createMockGameState('TestPlayer', 100);
      mockRepository.load.and.returnValue(mockState);

      fixture = TestBed.createComponent(GamePageComponent);
      component = fixture.componentInstance;

      expect(mockRepository.load).toHaveBeenCalled();
      expect(component.gameState().playerName).toBe('TestPlayer');
      expect(component.gameState().points).toBe(100);
    });

    it('should create default game state if repository returns null', () => {
      mockRepository.load.and.returnValue(null);

      fixture = TestBed.createComponent(GamePageComponent);
      component = fixture.componentInstance;

      expect(component.gameState().playerName).toBeDefined();
      expect(component.gameState().points).toBe(0);
    });

    it('should initialize with isGameStarted as false', () => {
      expect(component.isGameStarted()).toBe(false);
    });

    it('should initialize with activeMoleIndexes as empty array', () => {
      expect(component.activeMoleIndexes()).toEqual([]);
    });
  });

  describe('handleHit', () => {
    it('should not apply hit when holeIndex is not in activeMoleIndexes', () => {
      const initialPoints = component.gameState().points;
      component.activeMoleIndexes.set([]);

      component.handleHit(5);

      expect(component.gameState().points).toBe(initialPoints);
    });

    it('should remove hit mole from activeMoleIndexes after hit', fakeAsync(() => {
      component.activeMoleIndexes.set([5]);
      component.handleHit(5);
      tick();

      expect(component.activeMoleIndexes()).toEqual([]);
    }));

    it('should keep other moles active when hitting one of multiple', fakeAsync(() => {
      component.activeMoleIndexes.set([3, 5]);
      component.handleHit(5);
      tick();

      expect(component.activeMoleIndexes()).toEqual([3]);
    }));

    it('should move mole after hit delay when no moles remain', fakeAsync(() => {
      component.isGameStarted.set(true);
      component.activeMoleIndexes.set([5]);
      component.handleHit(5);

      expect(component.activeMoleIndexes()).toEqual([]);

      tick(500);

      expect(component.activeMoleIndexes().length).toBeGreaterThan(0);
    }));
  });

  describe('onDifficultyChange', () => {
    const difficultyTestCases = [
      { difficultyId: 'low', description: 'low difficulty' },
      { difficultyId: 'medium', description: 'medium difficulty' },
      { difficultyId: 'high', description: 'high difficulty' },
    ];

    difficultyTestCases.forEach(({ difficultyId, description }) => {
      it(`should change difficulty to ${description}`, () => {
        const event = {
          target: { value: difficultyId },
        } as unknown as Event;

        component.onDifficultyChange(event);

        expect(component.gameState().difficulty.id).toBe(difficultyId);
        expect(mockRepository.save).toHaveBeenCalled();
      });
    });

    it('should use default difficulty if event target is null', () => {
      const event = {
        target: null,
      } as unknown as Event;

      const initialDifficulty = component.gameState().difficulty.id;
      component.onDifficultyChange(event);

      expect(component.gameState().difficulty.id).toBe(initialDifficulty);
    });
  });

  describe('onRestart', () => {
    it('should reset game state and start game', fakeAsync(() => {
      component.gameState.set(createMockGameState('Player1', 100));
      component.isGameStarted.set(false);

      component.onRestart();
      tick(100);

      expect(component.gameState().points).toBe(0);
      expect(component.isGameStarted()).toBe(true);
      expect(component.gameState().isTimeBased).toBe(true);
      expect(component.gameState().timeRemaining).toBeDefined();
      expect(component.activeMoleIndexes().length).toBeGreaterThan(0);
      expect(component.activeMoleIndexes()[0]).toBeGreaterThanOrEqual(0);
      expect(component.activeMoleIndexes()[0]).toBeLessThan(
        component.holes.length
      );
    }));

    it('should start mole movement after restart', fakeAsync(() => {
      component.onRestart();
      tick(100);

      expect(component.activeMoleIndexes().length).toBeGreaterThan(0);
    }));
  });

  describe('onChangePlayer', () => {
    it('should stop mole movement', () => {
      component.activeMoleIndexes.set([5]);
      component.onChangePlayer();

      expect(component.activeMoleIndexes()).toEqual([]);
    });

    it('should clear repository', () => {
      component.onChangePlayer();

      expect(mockRepository.clear).toHaveBeenCalled();
    });

    it('should navigate to home', () => {
      component.onChangePlayer();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should stop mole movement on destroy', () => {
      component.activeMoleIndexes.set([5]);
      component.ngOnDestroy();

      expect(component.activeMoleIndexes()).toEqual([]);
    });
  });

  describe('mole movement', () => {
    it('should move mole to random index', fakeAsync(() => {
      component.isGameStarted.set(true);
      component.onRestart();
      fixture.detectChanges();

      tick(1000);

      const indexes = component.activeMoleIndexes();
      expect(indexes.length).toBeGreaterThan(0);
      expect(indexes[0]).toBeGreaterThanOrEqual(0);
      expect(indexes[0]).toBeLessThan(component.holes.length);
    }));

    const difficultyIntervals = [
      { difficultyId: 'low', expectedInterval: 1000 },
      { difficultyId: 'medium', expectedInterval: 750 },
      { difficultyId: 'high', expectedInterval: 500 },
    ];

    difficultyIntervals.forEach(({ difficultyId, expectedInterval }) => {
      it(`should use correct interval for ${difficultyId} difficulty`, fakeAsync(() => {
        const event = {
          target: { value: difficultyId },
        } as unknown as Event;
        component.onDifficultyChange(event);
        component.isGameStarted.set(true);
        component.onRestart();
        fixture.detectChanges();

        tick(100);
        const initialIndexes = component.activeMoleIndexes();
        expect(initialIndexes.length).toBeGreaterThan(0);
        const initialIndex = initialIndexes[0];
        expect(initialIndex).toBeGreaterThanOrEqual(0);
        expect(initialIndex).toBeLessThan(component.holes.length);

        const indices: number[] = [initialIndex];
        for (let i = 0; i < 3; i++) {
          tick(expectedInterval);
          const currentIndexes = component.activeMoleIndexes();
          expect(currentIndexes.length).toBeGreaterThan(0);
          const currentIndex = currentIndexes[0];
          indices.push(currentIndex);
          expect(currentIndex).toBeGreaterThanOrEqual(0);
          expect(currentIndex).toBeLessThan(component.holes.length);
        }

        const uniqueIndices = new Set(indices);
        expect(uniqueIndices.size).toBeGreaterThanOrEqual(1);
      }));
    });
  });

  describe('template rendering', () => {
    it('should display score board with player name and points', () => {
      fixture.detectChanges();

      const scoreBoard = fixture.nativeElement.querySelector('app-score-board');
      expect(scoreBoard).toBeTruthy();
    });

    it('should display difficulty selector', () => {
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('.game__select');
      expect(select).toBeTruthy();
    });

    it('should not show game board when game is not started', () => {
      component.isGameStarted.set(false);
      fixture.detectChanges();

      const gameBoard = fixture.nativeElement.querySelector('app-game-board');
      expect(gameBoard).toBeFalsy();
    });

    it('should show game board when game is started', () => {
      component.isGameStarted.set(true);
      fixture.detectChanges();

      const gameBoard = fixture.nativeElement.querySelector('app-game-board');
      expect(gameBoard).toBeTruthy();
    });

    it('should display exit button', () => {
      fixture.detectChanges();

      const exitButton = fixture.nativeElement.querySelector('.game__exit');
      expect(exitButton).toBeTruthy();
    });
  });
});
