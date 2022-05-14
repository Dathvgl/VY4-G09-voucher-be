import { Voucher } from 'src/voucher/voucher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  thumnail: string;

  @Column()
  content?: string;

  @Column({ default: () => 'CUCURRENT_TIMESTAMP()' })
  dateCreate: Date;

  @Column()
  partner: string;

  @OneToMany(() => Voucher, (voucher) => voucher.article)
  vouchers: [];
}
