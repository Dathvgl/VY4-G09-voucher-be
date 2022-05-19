import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GiftCardCreate } from './giftcard.dto';
import { GiftCard } from './giftcard.entity';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftcardRepo: Repository<GiftCard>,
  ) {}

  async findbyService(service: string): Promise<GiftCard[]> {
    return await this.giftcardRepo.find({
      where: { service: service },
    });
  }

  async findbyUser(user: string): Promise<GiftCard[]> {
    const giftcard = await this.giftcardRepo.find();
    return giftcard.filter((item) => item.userUse.includes(user));
  }

  async findOne(id: string): Promise<GiftCard> {
    return await this.giftcardRepo.findOne(id);
  }

  async createPartner(id: string, giftcard: GiftCardCreate): Promise<GiftCard> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const isExist = await this.giftcardRepo.findOne(giftcard.id);
    if (isExist != undefined) {
      errors.message['id'] = 'Mã đã tồn tại';
    }

    if (Object.keys(errors.message).length == 0) {
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    const newGiftCard = this.giftcardRepo.create({ ...giftcard });
    newGiftCard.partner = id;
    return await this.giftcardRepo.save(newGiftCard);
  }

  async updateUse(id: string, user: string): Promise<UpdateResult> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const giftcard = await this.findOne(id);

    if (giftcard == undefined) {
      errors.message['status'] = -1;
    }

    if (giftcard.userUse.includes(user)) {
      errors.message['status'] = 1;
    }

    if (Object.keys(errors.message).length == 0) {
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    giftcard.userUse.push(user);
    return await this.giftcardRepo.update(id, giftcard);
  }

  async updateOwned(id: string, user: string): Promise<UpdateResult> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const giftcard = await this.findOne(id);

    if (giftcard == undefined) {
      errors.message['status'] = -1;
    }

    if (giftcard.userOwned.includes(user)) {
      errors.message['status'] = 1;
    }

    if (Object.keys(errors.message).length == 0) {
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    giftcard.userOwned.push(user);
    return await this.giftcardRepo.update(id, giftcard);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.giftcardRepo.delete(id);
  }
}
