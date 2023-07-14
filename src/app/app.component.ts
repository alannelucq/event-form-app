import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { isAdultValidator } from "./validators/is-adult.validator";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl<Nullable<string>>(null, [Validators.required, isAdultValidator()]),
    adultTicketCount: new FormControl<Nullable<number>>(null, [Validators.required, Validators.min(0)]),
    childTicketCount: new FormControl<Nullable<number>>(null, [Validators.required, Validators.min(0)]),
  }, {
    validators: [this.hasAdultTicket()],
    updateOn: 'blur'
  });

  onSubmit() {
    console.log('Form has been submitted !');
  }

  private hasAdultTicket(): ValidatorFn {
    return (group: AbstractControl): Nullable<ValidationErrors> => {
      const {adultTicketCount, childTicketCount} = group.value;
      const hasChildTicketOnly = !adultTicketCount && childTicketCount;
      return hasChildTicketOnly ? { childTicketOnly: true } : null;
    }
  }
}
