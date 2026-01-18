import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MoleButtonComponent } from './mole-button';

describe('MoleButtonComponent', () => {
  let component: MoleButtonComponent;
  let fixture: ComponentFixture<MoleButtonComponent>;

  const setupTestBed = async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [MoleButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoleButtonComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onHit', () => {
    const testCases = [
      {
        isActive: true,
        shouldEmit: true,
        description: 'when button is active',
      },
      {
        isActive: false,
        shouldEmit: false,
        description: 'when button is not active',
      },
    ];

    describe('event emission', () => {
      testCases.forEach(({ isActive, shouldEmit, description }) => {
        it(`should ${shouldEmit ? '' : 'not '}emit hit event ${description}`, () => {
          fixture.componentRef.setInput('isActive', isActive);
          spyOn(component.hit, 'emit');

          component.onHit();

          if (shouldEmit) {
            expect(component.hit.emit).toHaveBeenCalledTimes(1);
          } else {
            expect(component.hit.emit).not.toHaveBeenCalled();
          }
        });
      });
    });

    describe('isHit state', () => {
      it('should set isHit to true when button is active', () => {
        fixture.componentRef.setInput('isActive', true);
        expect(component.isHit()).toBe(false);

        component.onHit();

        expect(component.isHit()).toBe(true);
      });

      it('should reset isHit to false after 200ms', fakeAsync(() => {
        fixture.componentRef.setInput('isActive', true);
        component.onHit();

        expect(component.isHit()).toBe(true);

        tick(200);

        expect(component.isHit()).toBe(false);
      }));

      it('should not set isHit when button is not active', () => {
        fixture.componentRef.setInput('isActive', false);
        expect(component.isHit()).toBe(false);

        component.onHit();

        expect(component.isHit()).toBe(false);
      });
    });
  });

  describe('template rendering', () => {
    describe('image visibility', () => {
      const imageTestCases = [
        {
          isActive: true,
          shouldShow: true,
          description: 'when isActive is true',
        },
        {
          isActive: false,
          shouldShow: false,
          description: 'when isActive is false',
        },
      ];

      imageTestCases.forEach(({ isActive, shouldShow, description }) => {
        it(`should ${shouldShow ? '' : 'not '}show image ${description}`, () => {
          fixture.componentRef.setInput('isActive', isActive);
          fixture.detectChanges();

          const image = fixture.nativeElement.querySelector('img');
          if (shouldShow) {
            expect(image).toBeTruthy();
            expect(image.getAttribute('src')).toBe('icons/topo.svg');
            expect(image.getAttribute('alt')).toBe('Topo');
          } else {
            expect(image).toBeFalsy();
          }
        });
      });
    });

    describe('CSS classes', () => {
      const classTestCases = [
        {
          isActive: true,
          isHit: false,
          expectedClasses: { active: true, hit: false },
          description: 'when isActive is true',
        },
        {
          isActive: false,
          isHit: false,
          expectedClasses: { active: false, hit: false },
          description: 'when isActive is false',
        },
        {
          isActive: true,
          isHit: true,
          expectedClasses: { active: true, hit: true },
          description: 'when isActive and isHit are true',
        },
      ];

      classTestCases.forEach(
        ({ isActive, isHit, expectedClasses, description }) => {
          it(`should apply correct classes ${description}`, () => {
            fixture.componentRef.setInput('isActive', isActive);
            if (isHit) {
              component.isHit.set(true);
            }
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('button');
            expect(button.classList.contains('mole-button--active')).toBe(
              expectedClasses.active
            );
            expect(button.classList.contains('mole-button--hit')).toBe(
              expectedClasses.hit
            );

            if (isActive && isHit) {
              const image = fixture.nativeElement.querySelector('img');
              expect(image.classList.contains('mole-button__image--hit')).toBe(
                true
              );
            }
          });
        }
      );
    });
  });
});
