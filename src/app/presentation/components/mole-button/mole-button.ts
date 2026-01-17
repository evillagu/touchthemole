import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-mole-button',
  templateUrl: './mole-button.html',
  styleUrl: './mole-button.scss'
})
export class MoleButtonComponent {
  readonly isActive = input<boolean>(false);
  readonly hit = output<void>();

  onHit(): void {
    if (this.isActive()) {
      this.hit.emit();
    }
  }
}


