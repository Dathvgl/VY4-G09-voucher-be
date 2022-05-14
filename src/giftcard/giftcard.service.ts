import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { findAllId_Dto, GiftCardCreate } from './giftcard.dto';
import { GiftCard } from './giftcard.entity';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftcardRepo: Repository<GiftCard>,
  ) {}

  async findAllId(): Promise<findAllId_Dto[]> {
    return await this.giftcardRepo.find({
      select: ['id'],
    });
  }

  async findUse(id: string): Promise<GiftCard> {
    return await this.giftcardRepo.findOne({
      where: { id: id },
    });
  }

  async findOne(id: string): Promise<GiftCard> {
    return await this.giftcardRepo.findOne(id);
  }

  async createPartner(id: string, giftcard: GiftCardCreate): Promise<GiftCard> {
    const isExist = await this.giftcardRepo.findOne(giftcard.id);
    if (isExist != undefined) throw new ConflictException('Thẻ đã có');

    const newGiftCard = this.giftcardRepo.create({ ...giftcard });
    newGiftCard.partner = id;
    return await this.giftcardRepo.save(newGiftCard);
  }

  async update(giftcard: GiftCard): Promise<UpdateResult> {
    return await this.giftcardRepo.update(giftcard.id, giftcard);
  }

  async updateUse(id: string, user: string): Promise<UpdateResult> {
    const giftcard = await this.findOne(id);

    if (giftcard == undefined)
      throw new ConflictException('Thẻ quà tặng không tồn tại');

    if (giftcard.userUse.includes(user))
      throw new ConflictException('User đã sử dụng thẻ quà tặng');

    giftcard.userUse.push(user);
    return await this.giftcardRepo.update(id, giftcard);
  }

  async updateOwned(id: string, user: string): Promise<UpdateResult> {
    const giftcard = await this.findOne(id);

    if (giftcard == undefined)
      throw new ConflictException('Thẻ quà tặng không tồn tại');

    if (giftcard.userOwned.includes(user))
      throw new ConflictException('User đã đổi thẻ quà tặng');

    giftcard.userOwned.push(user);
    return await this.giftcardRepo.update(id, giftcard);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.giftcardRepo.delete(id);
  }
}
