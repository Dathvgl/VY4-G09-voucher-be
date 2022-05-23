import { Article } from 'src/article/article.entity';

export class createVoucher_Dto {
  id: string;
  name: string;
  content: string;
  discount: number;
  limited: number;
  price: number;
  quantity: number;
  dateStart: Date;
  dateEnd: Date;
  service: string;
  priceAct: number;
  placeUse: string;
}

export class updateArticle_Dto {
  article?: Article;
}
