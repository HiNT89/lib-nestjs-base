import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          // Hỗ trợ: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx
          return /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là số điện thoại Việt Nam hợp lệ`;
        },
      },
    });
  };
}
