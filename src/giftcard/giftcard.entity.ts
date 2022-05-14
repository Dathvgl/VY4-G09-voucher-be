import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GiftCard {
  @PrimaryColumn()
  id: string;
  
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  partner: string;
  @Column({ default: () => 'CUCURRENT_TIMESTAMP()' })
  dateCreate: Date;
  
  @Column({ type: 'simple-array' })
  userUse: string[];
  @Column({ type: 'simple-array' })
  userOwned: string[];
}
