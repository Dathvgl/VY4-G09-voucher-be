export class ArticleCreate {
  name: string;
  content?: string;
  partner: string;
  thumnail: string;
}

export class ArticleUpdate {
  content: string;
  thumnail: string;
}
