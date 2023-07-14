import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { differenceInYears } from 'date-fns'

export function isAdultValidator(): ValidatorFn {
  return (({value}: AbstractControl): Nullable<ValidationErrors> => {
    if (!value) return null;
    const today = new Date();
    const birthDate = new Date(value);
    const isAdult = differenceInYears(today, birthDate) >= 18;
    return isAdult ? null : { isUnderAge: true};
  })
}

