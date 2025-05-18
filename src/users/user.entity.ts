import { AbstractEntity } from '@/common/abtracts/abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  gender: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  date_of_birth: Date;
}
