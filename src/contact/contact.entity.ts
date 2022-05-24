import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  type: string;

  @Column()
  category: string;

  @Column()
  code: string;

  @Column({ default: () => 'CUCURRENT_TIMESTAMP()' })
  dateCreate: Date;
}
