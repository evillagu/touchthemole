import { Routes } from '@angular/router';
import { GamePageComponent } from './presentation/pages/game/game';
import { HomePageComponent } from './presentation/pages/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomePageComponent },
  { path: 'game', component: GamePageComponent },
  { path: '**', redirectTo: 'home' }
];
