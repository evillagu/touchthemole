import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreBoardComponent } from './score-board';

describe('ScoreBoardComponent', () => {
  let component: ScoreBoardComponent;
  let fixture: ComponentFixture<ScoreBoardComponent>;

  const setupTestBed = async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ScoreBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBoardComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('playerName input', () => {
    const playerNameTestCases = [
      {
        playerName: 'TestPlayer',
        expected: 'TestPlayer',
        description: 'valid player name',
      },
      { playerName: '', expected: '', description: 'empty string' },
      {
        playerName: 'Player123',
        expected: 'Player123',
        description: 'player name with numbers',
      },
    ];

    describe('display values', () => {
      playerNameTestCases.forEach(({ playerName, expected, description }) => {
        it(`should display ${description}`, () => {
          fixture.componentRef.setInput('playerName', playerName);
          fixture.detectChanges();

          const playerStats =
            fixture.nativeElement.querySelectorAll('.score-board__stat');
          const playerValue = playerStats[0].querySelector(
            '.score-board__value'
          );
          expect(playerValue.textContent.trim()).toBe(expected);
        });
      });
    });

    describe('input updates', () => {
      it('should update player name when input changes', () => {
        const testCases = [
          { input: 'Player1', expected: 'Player1' },
          { input: 'Player2', expected: 'Player2' },
          { input: 'Player3', expected: 'Player3' },
        ];

        testCases.forEach(({ input, expected }) => {
          fixture.componentRef.setInput('playerName', input);
          fixture.detectChanges();

          const playerValue = fixture.nativeElement
            .querySelectorAll('.score-board__stat')[0]
            .querySelector('.score-board__value');
          expect(playerValue.textContent.trim()).toBe(expected);
        });
      });
    });
  });

  describe('points input', () => {
    const pointsTestCases = [
      { points: 100, expected: '100', description: 'positive points' },
      { points: 0, expected: '0', description: 'zero points' },
      { points: 999, expected: '999', description: 'high points' },
      { points: 50, expected: '50', description: 'medium points' },
    ];

    describe('display values', () => {
      pointsTestCases.forEach(({ points, expected, description }) => {
        it(`should display ${description}`, () => {
          fixture.componentRef.setInput('points', points);
          fixture.detectChanges();

          const stats =
            fixture.nativeElement.querySelectorAll('.score-board__stat');
          const pointsValue = stats[1].querySelector('.score-board__value');
          expect(pointsValue.textContent.trim()).toBe(expected);
        });
      });
    });

    describe('input updates', () => {
      it('should update points when input changes', () => {
        const testCases = [
          { input: 50, expected: '50' },
          { input: 150, expected: '150' },
          { input: 200, expected: '200' },
        ];

        testCases.forEach(({ input, expected }) => {
          fixture.componentRef.setInput('points', input);
          fixture.detectChanges();

          const pointsValue = fixture.nativeElement
            .querySelectorAll('.score-board__stat')[1]
            .querySelector('.score-board__value');
          expect(pointsValue.textContent.trim()).toBe(expected);
        });
      });
    });

    describe('template structure', () => {
      const expectedStructure = {
        statCount: 2,
        labels: [
          { text: 'Jugador', i18n: '@@scoreboard.player.label' },
          { text: 'Puntos', i18n: '@@scoreboard.points.label' },
        ],
      };

      it('should render correct number of stat divs', () => {
        fixture.detectChanges();

        const stats =
          fixture.nativeElement.querySelectorAll('.score-board__stat');
        expect(stats.length).toBe(expectedStructure.statCount);
      });

      it('should have correct labels with i18n attributes', () => {
        fixture.detectChanges();

        const labels = fixture.nativeElement.querySelectorAll(
          '.score-board__label'
        );
        expect(labels.length).toBe(expectedStructure.labels.length);

        expectedStructure.labels.forEach((expectedLabel, index) => {
          const label = labels[index];
          expect(label).toBeTruthy();
          expect(label.textContent.trim()).toBe(expectedLabel.text);
          const i18nAttribute = label.getAttribute('i18n');
          if (i18nAttribute !== null) {
            expect(i18nAttribute).toBe(expectedLabel.i18n);
          }
        });
      });

      it('should have correct value elements', () => {
        fixture.componentRef.setInput('playerName', 'Test');
        fixture.componentRef.setInput('points', 10);
        fixture.detectChanges();

        const values = fixture.nativeElement.querySelectorAll(
          '.score-board__value'
        );
        expect(values.length).toBe(2);
        values.forEach((value: HTMLElement) => {
          expect(value.tagName).toBe('STRONG');
        });
      });
    });
  });
});
