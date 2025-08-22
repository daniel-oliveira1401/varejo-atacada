import { Component, Input } from '@angular/core';

type LogoSize = 'small' | 'medium' | 'big' | 'huge';

@Component({
  selector: 'app-logo-component',
  imports: [],
  templateUrl: './logo-component.html',
  styleUrl: './logo-component.scss'
})
export class LogoComponent {
  @Input() size : LogoSize = 'medium';

  getSize(){
    switch(this.size){
      case 'small': return '100%';
      case 'medium': return '120%';
      case 'big': return '150%';
      case 'huge': return '180%';
    }
  }
}
