import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isValidDate } from '../../utils/date.util';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isValidDate(value)) {
            return false;
          }
          const currentDate = new Date();
          return new Date(value) > currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return validationOptions.message
            ? (validationOptions.message as string)
            : `${args.property} must be a future date`;
        },
      },
    });
  };
}

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isValidDate(value)) {
            return false;
          }
          const currentDate = new Date();
          return new Date(value) < currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return validationOptions.message
            ? (validationOptions.message as string)
            : `${args.property} must be a past date`;
        },
      },
    });
  };
}

export function IsEndDate(
  startDatekey: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const startDate = object[startDatekey];
          if (!startDate) {
            return false;
          }
          if (!isValidDate(startDate)) {
            return false;
          }
          if (!isValidDate(value)) {
            return false;
          }
          return new Date(value) > new Date(startDate);
        },
        defaultMessage(args: ValidationArguments) {
          return validationOptions.message
            ? (validationOptions.message as string)
            : `${args.property} must be a greater than ${startDatekey}`;
        },
      },
    });
  };
}
