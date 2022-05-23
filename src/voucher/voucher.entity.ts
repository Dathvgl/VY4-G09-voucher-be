import { Article } from 'src/article/article.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryColumn()
  id: string;
  
  @Column()
  name: string;
  @Column()
  content: string;

  @Column()
  discount: number;
  @Column()
  limited: number;
  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column()
  partner: string;
  @Column({ default: () => 'CUCURRENT_TIMESTAMP()' })
  dateCreate: Date;
  @Column({ nullable: true })
  dateStart?: Date;
  @Column({ nullable: true })
  dateEnd?: Date;
  
  @Column()
  service: string;
  @Column({ default: 0 })
  priceAct: number;
  @Column({ nullable: true })
  placeUse: string;

  @ManyToOne(() => Article, (article) => article.vouchers, {
    nullable: true,
  })
  article?: Article;
}
