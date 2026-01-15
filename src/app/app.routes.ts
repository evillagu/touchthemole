import { Routes } from '@angular/router';
import { GamePage } from './presentation/pages/game/game';
import { HomePage } from './presentation/pages/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomePage },
  { path: 'game', component: GamePage },
  { path: '**', redirectTo: 'home' }
];
