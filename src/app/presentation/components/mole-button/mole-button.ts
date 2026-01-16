import { Component, output } from '@angular/core';

@Component({
  selector: 'app-mole-button',
  templateUrl: './mole-button.html'
})
export class MoleButtonComponent {
  readonly hit = output<void>();
}


