import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board';
import { MoleButtonComponent } from '../mole-button/mole-button';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, MoleButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleHit', () => {
    const hitTestCases = [
      { 
        activeMoleIndex: 2, 
        holeIndex: 2, 
        shouldCall: true, 
        description: 'when activeMoleIndex matches holeIndex' 
      },
      { 
        activeMoleIndex: 2, 
        holeIndex: 5, 
        shouldCall: false, 
        description: 'when activeMoleIndex does not match holeIndex' 
      },
      { 
        activeMoleIndex: null, 
        holeIndex: 2, 
        shouldCall: false, 
        description: 'when activeMoleIndex is null' 
      }
    ];

    hitTestCases.forEach(({ activeMoleIndex, holeIndex, shouldCall, description }) => {
      it(`should ${shouldCall ? '' : 'not '}call onHit ${description}`, () => {
        const mockOnHit = jasmine.createSpy('onHit');
        fixture.componentRef.setInput('onHit', mockOnHit);
        fixture.componentRef.setInput('activeMoleIndex', activeMoleIndex);

        component.handleHit(holeIndex);

        if (shouldCall) {
          expect(mockOnHit).toHaveBeenCalledTimes(1);
        } else {
          expect(mockOnHit).not.toHaveBeenCalled();
        }
      });
    });

    it('should handle undefined onHit gracefully', () => {
      fixture.componentRef.setInput('onHit', undefined);
      fixture.componentRef.setInput('activeMoleIndex', 2);

      expect(() => component.handleHit(2)).not.toThrow();
    });
  });

  describe('template rendering', () => {
    const holesTestCases = [
      { holes: [0, 1, 2, 3, 4, 5, 6, 7, 8], expectedCount: 9, description: '9 holes' },
      { holes: [0, 1, 2], expectedCount: 3, description: '3 holes' },
      { holes: [], expectedCount: 0, description: 'empty array' }
    ];

    holesTestCases.forEach(({ holes, expectedCount, description }) => {
      it(`should render ${expectedCount} buttons for ${description}`, () => {
        fixture.componentRef.setInput('holes', holes);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('app-mole-button');
        expect(buttons.length).toBe(expectedCount);
      });
    });

    const activeIndexTestCases = [
      { 
        holes: [0, 1, 2], 
        activeMoleIndex: 1, 
        expectedActive: [false, true, false],
        description: 'when activeMoleIndex is 1'
      },
      { 
        holes: [0, 1, 2], 
        activeMoleIndex: 0, 
        expectedActive: [true, false, false],
        description: 'when activeMoleIndex is 0'
      },
      { 
        holes: [0, 1, 2], 
        activeMoleIndex: null, 
        expectedActive: [false, false, false],
        description: 'when activeMoleIndex is null'
      }
    ];

    activeIndexTestCases.forEach(({ holes, activeMoleIndex, expectedActive, description }) => {
      it(`should pass correct isActive to each button ${description}`, () => {
        fixture.componentRef.setInput('holes', holes);
        fixture.componentRef.setInput('activeMoleIndex', activeMoleIndex);
        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll('app-mole-button');
        buttons.forEach((button: HTMLElement, index: number) => {
          expect(button.getAttribute('ng-reflect-is-active')).toBe(String(expectedActive[index]));
        });
      });
    });

    it('should have game-board__grid class on container', () => {
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.game-board__grid');
      expect(container).toBeTruthy();
    });
  });
});
