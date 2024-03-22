import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-testing-services-2';

  ngOnInit(){
    const calculator = new Calculator()
    const rta = calculator.multiply(3,3)
    console.log(rta ===9);

    const rta2 = calculator.divide(3,0)
    console.log(rta2 ===null);

  }
}
