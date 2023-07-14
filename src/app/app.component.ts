import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    birthDate: new FormControl<Nullable<string>>(null),
    adultTicketCount: new FormControl<Nullable<number>>(1),
    childTicketCount: new FormControl<Nullable<number>>(2),
  });

  onSubmit() {
    console.log('Form has been submitted !');
  }
}
