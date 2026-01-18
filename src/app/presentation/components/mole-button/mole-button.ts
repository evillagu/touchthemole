import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-mole-button',
  templateUrl: './mole-button.html',
  styleUrl: './mole-button.scss',
})
export class MoleButtonComponent {
  readonly isActive = input<boolean>(false);
  readonly hit = output<void>();
  readonly isHit = signal<boolean>(false);

  onHit(): void {
    if (this.isActive()) {
      this.isHit.set(true);
      this.hit.emit();
      setTimeout(() => {
        this.isHit.set(false);
      }, 200);
    }
  }
}
