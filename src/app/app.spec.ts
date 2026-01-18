import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const setupTestBed = async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await setupTestBed();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title signal', () => {
    expect(component.title()).toBe('touch-the-mole');
  });

  describe('template rendering', () => {
    it('should render router outlet', () => {
      fixture.detectChanges();

      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });
  });
});
