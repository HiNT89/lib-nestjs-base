import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { IsVietnamesePhoneNumber } from './is-vietnam-phone.decorator';

export type BaseFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'date'
  | 'enum'
  | 'password'
  | 'username';

export interface BaseFieldOptions {
  type: BaseFieldType;
  isRequired?: boolean;
  isExpose?: boolean;
  example?: any;
  description?: string;
  enumData?: object;
  minLength?: number;
  maxLength?: number;
}

/**
 * Định nghĩa decorator đa năng cho nhiều loại field khác nhau
 */
export function BaseField(options: BaseFieldOptions) {
  const {
    type,
    isRequired = false,
    isExpose = true,
    example,
    description,
    enumData,
    minLength = 0,
    maxLength = 255,
  } = options;

  const decorators: (PropertyDecorator | ClassDecorator)[] = [];

  // Optional
  if (!isRequired) {
    decorators.push(IsOptional());
  }

  // Type-specific validators
  switch (type) {
    case 'string':
      decorators.push(
        IsString({ message: `${description || 'Trường'} phải là chuỗi` }),
        MinLength(minLength, { message: `Tối thiểu ${minLength} ký tự` }),
        MaxLength(maxLength, { message: `Tối đa ${maxLength} ký tự` }),
      );
      break;

    case 'email':
      decorators.push(IsEmail({}, { message: 'Email không hợp lệ' }));
      break;

    case 'phone':
      decorators.push(
        IsVietnamesePhoneNumber({
          message: 'Số điện thoại không hợp lệ (VD: 0912345678, +84912345678)',
        }),
      );
      break;

    case 'date':
      decorators.push(
        Type(() => Date),
        IsDate({ message: 'Ngày không hợp lệ' }),
      );
      break;

    case 'number':
      decorators.push(
        Type(() => Number),
        IsNumber({}, { message: `${description || 'Trường'} phải là số` }),
      );
      break;

    case 'boolean':
      decorators.push(
        Type(() => Boolean),
        IsBoolean({ message: `${description || 'Trường'} phải là true/false` }),
      );
      break;

    case 'enum':
      if (enumData) {
        decorators.push(
          IsEnum(enumData, {
            message: `${description || 'Trường'} không hợp lệ`,
          }),
        );
      }
      break;

    case 'password':
      decorators.push(
        IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' }),
        IsString(),
        MinLength(minLength, {
          message: `Mật khẩu tối thiểu ${minLength} ký tự`,
        }),
        MaxLength(maxLength, {
          message: `Mật khẩu tối đa ${maxLength} ký tự`,
        }),
        Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
          message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
        }),
      );
      break;

    case 'username':
      decorators.push(
        IsNotEmpty({ message: 'Tên đăng nhập không được bỏ trống' }),
        IsString(),
        MinLength(4, { message: 'Tên đăng nhập tối thiểu 4 ký tự' }),
        MaxLength(20, { message: 'Tên đăng nhập tối đa 20 ký tự' }),
        Matches(/^[a-zA-Z0-9_]+$/, {
          message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
        }),
      );
      break;
  }

  // Expose
  if (isExpose) {
    decorators.push(Expose());
  }

  // Swagger decorators
  const swaggerDecorator = isRequired
    ? ApiProperty({
        example,
        description,
        enum: enumData,
        type: mapToSwaggerType(type),
      })
    : ApiPropertyOptional({
        example,
        description,
        enum: enumData,
        type: mapToSwaggerType(type),
      });

  decorators.push(swaggerDecorator);

  return applyDecorators(...decorators);
}

function mapToSwaggerType(
  type: BaseFieldType,
): 'string' | 'number' | 'boolean' {
  switch (type) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'string'; // Mặc định cho 'string', 'email', 'password', 'username', 'phone', v.v.
  }
}
