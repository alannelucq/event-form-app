import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { isAdultValidator } from "./validators/is-adult.validator";
import { map, Observable } from "rxjs";
import { EventGateway } from "./gateways/event.gateway";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  eventGateway = inject(EventGateway);

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl<Nullable<string>>(null, [Validators.required, isAdultValidator()]),
    adultTicketCount: new FormControl<Nullable<number>>(null, [Validators.required, Validators.min(0)]),
    childTicketCount: new FormControl<Nullable<number>>(null, [Validators.required, Validators.min(0)]),
  }, {
    validators: [this.hasAdultTicket()],
    asyncValidators: [this.remainsSeats()],
    updateOn: 'blur'
  });

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    console.log('Form has been submitted !');
  }

  private hasAdultTicket(): ValidatorFn {
    return (group: AbstractControl): Nullable<ValidationErrors> => {
      const {adultTicketCount, childTicketCount} = group.value;
      const hasChildTicketOnly = !adultTicketCount && childTicketCount;
      return hasChildTicketOnly ? { childTicketOnly: true } : null;
    }
  }

  private remainsSeats(): AsyncValidatorFn {
    return (group: AbstractControl): Observable<Nullable<ValidationErrors>> => {
      const {adultTicketCount, childTicketCount} = group.value;
      const totalSeatsCount = (adultTicketCount || 0) + (childTicketCount || 0);
      return this.eventGateway.retrieveRemainingSeats().pipe(
        map(({ remainingSeats }) => remainingSeats >= totalSeatsCount ? null : { remainingSeats  })
      );
    }
  }
}
