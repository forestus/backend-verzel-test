import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false, nullable: false })
  master: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
