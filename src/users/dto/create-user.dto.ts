import { BaseField } from '@/common/decorators/field.decorators';
import { Gender } from '@/constants/gender.constant';

enum Role {
  Admin = 'admin',
  User = 'user',
}

export class CreateUserDto {
  @BaseField({
    type: 'username',
    description: 'Tên đăng nhập hệ thống',
    example: 'hint_dev',
    isRequired: true,
  })
  username: string;

  @BaseField({
    type: 'password',
    description: 'Mật khẩu chứa chữ hoa, chữ thường và số',
    example: 'StrongPass123',
    isRequired: true,
    minLength: 6,
    maxLength: 32,
  })
  password: string;

  @BaseField({
    type: 'string',
    description: 'Họ tên',
    example: 'Nguyễn Văn A',
    isRequired: true,
  })
  full_name: string;

  @BaseField({
    type: 'email',
    example: 'example@gmail.com',
    isRequired: true,
  })
  email: string;

  @BaseField({
    type: 'phone',
    description: 'Số điện thoại Việt Nam',
    example: '0987654321',
    isRequired: true,
  })
  phone_number: string;

  @BaseField({
    type: 'date',
    description: 'Định dạng: YYYY-MM-DD',
    example: '1990-01-01',
    isRequired: true,
  })
  date_of_birth: Date;

  @BaseField({
    type: 'enum',
    description: 'Giới tính (0: Unknown, 1: Male, 2: Female)',
    example: Gender.Male,
    enumData: Gender,
    isRequired: false,
  })
  gender: Gender;

  @BaseField({
    type: 'string',
    description: 'Địa chỉ',
    example: 'Hà Nội',
    isRequired: true,
  })
  address: string;

  @BaseField({
    type: 'string',
    description: 'Ghi chú',
    example: 'Cao',
    isRequired: true,
  })
  note: string;

  @BaseField({
    type: 'number',
    description: 'ID công ty',
    example: 123,
    isRequired: false,
  })
  company_id: number;

  @BaseField({
    type: 'boolean',
    description: 'Kích hoạt',
    example: true,
    isRequired: true,
  })
  is_active: boolean;

  @BaseField({
    type: 'enum',
    enumData: Role,
    description: 'Vai trò người dùng',
    example: Role.User,
    isRequired: true,
  })
  role: Role;
}
