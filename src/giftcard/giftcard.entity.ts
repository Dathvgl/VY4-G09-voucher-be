import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GiftCard {
  @PrimaryColumn()
  id: string;
  
  @Column()
  name: string;

  @Column()
  service: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  partner: string;
  @Column({ default: () => 'CUCURRENT_TIMESTAMP()' })
  dateCreate: Date;
}
