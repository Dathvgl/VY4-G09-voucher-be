import { Article } from "src/article/article.entity";

export class findAllId_Dto {
  id: string;
}

export class createVoucher_Dto {
  id: string;
  name: string;
  content: string;
  discount: number;
  limited: number;
  price: number;
  quantity: number;
  dateStart?: Date;
  dateEnd?: Date;
  service: string;
  priceAt: number;
  placeUse: string[];
}

export class updateArticle_Dto {
  article?: Article;
}
