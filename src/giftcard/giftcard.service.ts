import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createContact_Dto } from 'src/contact/contact.dto';
import { ContactService } from 'src/contact/contact.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GiftCardCreate } from './giftcard.dto';
import { GiftCard } from './giftcard.entity';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftcardRepo: Repository<GiftCard>,
    private readonly contactService: ContactService,
  ) {}

  async findAll(): Promise<GiftCard[]> {
    return await this.giftcardRepo.find();
  }

  async findbyService(service: string): Promise<GiftCard[]> {
    return await this.giftcardRepo.find({
      select: [
        'id',
        'name',
        'price',
        'quantity',
        'service',
      ],
      where: { service: service },
    });
  }

  async findbyUser(user: string): Promise<GiftCard[]> {
    const contactOwned = await this.contactService.findbyUser(
      user,
      'Owned',
      'Giftcard',
    );

    const contactUse = await this.contactService.findbyUser(
      user,
      'Use',
      'Giftcard',
    );

    if (contactOwned.length == 0) {
      return [];
    }

    const _giftcards = [];
    for (let i = 0; i < contactOwned.length; i++) {
      const item = await this.findbyId(contactOwned[i].code);
      _giftcards.push(item);
    }

    const giftcards = [];
    const n = _giftcards.length;
    for (let i = 0; i < n; i++) {
      giftcards.push({ ..._giftcards[i] });

      if (contactUse.filter((x) => x.code == giftcards[i].id).length > 0) {
        giftcards[i].status = 1;
        continue;
      }

      giftcards[i].status = 0;
    }

    return giftcards;
  }

  async findbyId(id: string): Promise<GiftCard> {
    return await this.giftcardRepo.findOne({
      select: [
        'id',
        'name',
        'price',
        'quantity',
        'service',
      ],
      where: { id: id },
    });
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
    
    if (Object.keys(errors.message).length != 0) {
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

    const giftcard = await this.giftcardRepo.findOne(id);
    if (giftcard == undefined) {
      errors.message['id'] = 'Mã không tồn tại';
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    const contactUse = await this.contactService.findbyCode(
      id,
      'Use',
      'Giftcard',
    );

    if (giftcard.quantity > 0) {
      if (giftcard.quantity == contactUse.length) {
        errors.message['quantity'] = 'Hết lượt sử dụng';
        throw new HttpException(errors, HttpStatus.FORBIDDEN);
      }
    }

    const contact: createContact_Dto = {
      user: user,
      type: 'Use',
      category: 'Giftcard',
      code: id,
    };

    this.contactService.create(contact);

    return await this.giftcardRepo.update(id, giftcard);
  }

  async updateOwned(id: string, user: string): Promise<UpdateResult> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const contactOwned = await this.contactService.findbyUser(
      user,
      'Owned',
      'Giftcard',
    );

    if (contactOwned.length > 0) {
      errors.message['id'] = 'Đã sở hữu';
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    const giftcard = await this.giftcardRepo.findOne(id);
    const contactOwn = await this.contactService.findbyCode(
      id,
      'Owned',
      'Giftcard',
    );

    if (giftcard.quantity > 0) {
      if (giftcard.quantity == contactOwn.length) {
        errors.message['quantity'] = 'Hết lượt mua';
        throw new HttpException(errors, HttpStatus.FORBIDDEN);
      }
    }

    const contact: createContact_Dto = {
      user: user,
      type: 'Owned',
      category: 'Giftcard',
      code: id,
    };

    this.contactService.create(contact);

    return null;
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.giftcardRepo.delete(id);
  }
}
