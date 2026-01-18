import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board';
import { MoleButtonComponent } from '../mole-button/mole-button';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  const setupTestBed = async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, MoleButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleHit', () => {
    const hitTestCases = [
      {
        activeMoleIndexes: [2],
        holeIndex: 2,
        shouldCall: true,
        description: 'when holeIndex is in activeMoleIndexes',
      },
      {
        activeMoleIndexes: [2],
        holeIndex: 5,
        shouldCall: false,
        description: 'when holeIndex is not in activeMoleIndexes',
      },
      {
        activeMoleIndexes: [],
        holeIndex: 2,
        shouldCall: false,
        description: 'when activeMoleIndexes is empty',
      },
      {
        activeMoleIndexes: [1, 3],
        holeIndex: 3,
        shouldCall: true,
        description: 'when holeIndex is in activeMoleIndexes with multiple moles',
      },
      {
        activeMoleIndexes: [1, 3],
        holeIndex: 5,
        shouldCall: false,
        description: 'when holeIndex is not in activeMoleIndexes with multiple moles',
      },
    ];

    describe('hit conditions', () => {
      hitTestCases.forEach(
        ({ activeMoleIndexes, holeIndex, shouldCall, description }) => {
          it(`should ${shouldCall ? '' : 'not '}call onHit ${description}`, () => {
            const mockOnHit = jasmine.createSpy('onHit');
            fixture.componentRef.setInput('onHit', mockOnHit);
            fixture.componentRef.setInput('activeMoleIndexes', activeMoleIndexes);

            component.handleHit(holeIndex);

            if (shouldCall) {
              expect(mockOnHit).toHaveBeenCalledTimes(1);
              expect(mockOnHit).toHaveBeenCalledWith(holeIndex);
            } else {
              expect(mockOnHit).not.toHaveBeenCalled();
            }
          });
        }
      );
    });

    it('should handle undefined onHit gracefully', () => {
      fixture.componentRef.setInput('onHit', undefined);
      fixture.componentRef.setInput('activeMoleIndexes', [2]);

      expect(() => component.handleHit(2)).not.toThrow();
    });
  });

  describe('template rendering', () => {
    const holesTestCases = [
      {
        holes: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        expectedCount: 9,
        description: '9 holes',
      },
      { holes: [0, 1, 2], expectedCount: 3, description: '3 holes' },
      { holes: [], expectedCount: 0, description: 'empty array' },
    ];

    describe('button rendering', () => {
      holesTestCases.forEach(({ holes, expectedCount, description }) => {
        it(`should render ${expectedCount} buttons for ${description}`, () => {
          fixture.componentRef.setInput('holes', holes);
          fixture.detectChanges();

          const buttons =
            fixture.nativeElement.querySelectorAll('app-mole-button');
          expect(buttons.length).toBe(expectedCount);
        });
      });
    });

    describe('active index handling', () => {
      const activeIndexTestCases = [
        {
          holes: [0, 1, 2],
          activeMoleIndexes: [1],
          expectedActive: [false, true, false],
          description: 'when activeMoleIndexes contains 1',
        },
        {
          holes: [0, 1, 2],
          activeMoleIndexes: [0],
          expectedActive: [true, false, false],
          description: 'when activeMoleIndexes contains 0',
        },
        {
          holes: [0, 1, 2],
          activeMoleIndexes: [],
          expectedActive: [false, false, false],
          description: 'when activeMoleIndexes is empty',
        },
        {
          holes: [0, 1, 2],
          activeMoleIndexes: [0, 2],
          expectedActive: [true, false, true],
          description: 'when activeMoleIndexes contains multiple indices',
        },
      ];

      activeIndexTestCases.forEach(
        ({ holes, activeMoleIndexes, expectedActive, description }) => {
          it(`should pass correct isActive to each button ${description}`, () => {
            fixture.componentRef.setInput('holes', holes);
            fixture.componentRef.setInput('activeMoleIndexes', activeMoleIndexes);
            fixture.detectChanges();

            const buttons =
              fixture.nativeElement.querySelectorAll('app-mole-button');
            buttons.forEach((button: HTMLElement, index: number) => {
              const buttonElement = button.querySelector('button');
              expect(buttonElement).toBeTruthy();
              if (expectedActive[index]) {
                expect(buttonElement?.classList.contains('mole-button--active')).toBe(true);
              } else {
                expect(buttonElement?.classList.contains('mole-button--active')).toBe(false);
              }
            });
          });
        }
      );
    });

    it('should have game-board__grid class on container', () => {
      fixture.detectChanges();

      const container =
        fixture.nativeElement.querySelector('.game-board__grid');
      expect(container).toBeTruthy();
    });
  });
});
