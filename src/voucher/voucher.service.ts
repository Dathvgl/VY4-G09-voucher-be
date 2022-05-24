import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createContact_Dto } from 'src/contact/contact.dto';
import { ContactService } from 'src/contact/contact.service';
import { DeleteResult, MoreThan, Repository, UpdateResult } from 'typeorm';
import {
  updateArticle_Dto,
  createVoucher_Dto,
} from './voucher.dto';
import { Voucher } from './voucher.entity';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private readonly contactService: ContactService,
  ) {}

  async findAll(): Promise<Voucher[]> {
    return await this.voucherRepo.find();
  }

  async findbyService(service: string): Promise<Voucher[]> {
    const res = await this.voucherRepo.find({
      select: [
        'id',
        'name',
        'content',
        'discount',
        'limited',
        'price',
        'quantity',
        'dateStart',
        'dateEnd',
        'priceAct',
      ],
      where: { service: service },
    });

    const array = [];
    res.forEach((item, index) => {
      array[index] = item;
      const todaySplit = new Date();

      if (item.dateStart == null && item.dateEnd != null)
        if (todaySplit > item.dateEnd) {
          array[index].status = 'Đã quá hạn';
          return;
        }

      if (item.dateEnd == null) {
        array[index].status = 'Vô thời hạn';
        return;
      }

      if (item.dateStart != null) {
        if (todaySplit < item.dateStart) {
          array[index].status = 'Chưa quá hạn';
          return;
        }

        array[index].status = 'Đang kích hoạt';
        return;
      }
    });

    return array;
  }

  async findbyUser(user: string): Promise<Voucher[]> {
    const contactOwned = await this.contactService.findbyUser(
      user,
      'Owned',
      'Voucher',
    );

    const contactUse = await this.contactService.findbyUser(
      user,
      'Use',
      'Voucher',
    );

    if (contactOwned.length == 0) {
      return [];
    }

    const _vouchers = [];
    for (let i = 0; i < contactOwned.length; i++) {
      const item = await this.findbyId(contactOwned[i].code);
      _vouchers.push(item);
    }

    const vouchers = [];
    const n = _vouchers.length;
    for (let i = 0; i < n; i++) {
      vouchers.push({ ..._vouchers[i] });

      if (contactUse.filter((x) => x.code == vouchers[i].id).length > 0) {
        vouchers[i].status = 1;
        continue;
      }

      if (
        vouchers[i].status == 'Vô thời hạn' ||
        vouchers[i].status == 'Đang kích hoạt'
      ) {
        vouchers[i].status = 0;
        continue;
      }

      vouchers[i].status = 2;
    }

    return vouchers;
  }

  async findbyFree(service: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      select: [
        'id',
        'name',
        'content',
        'discount',
        'limited',
        'price',
        'quantity',
        'dateStart',
        'dateEnd',
        'service',
        'priceAct',
      ],
      where: { price: 0, service: service },
    });
  }

  async findbyBuy(service: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      select: [
        'id',
        'name',
        'content',
        'discount',
        'limited',
        'price',
        'quantity',
        'dateStart',
        'dateEnd',
        'service',
        'priceAct',
      ],
      where: { price: MoreThan(0), service: service },
    });
  }

  async findbyId(id: string): Promise<Voucher> {
    const res = await this.voucherRepo.findOne({
      select: [
        'id',
        'name',
        'content',
        'discount',
        'limited',
        'price',
        'quantity',
        'service',
        'priceAct',
        'placeUse',
      ],
      where: { id: id },
    });

    const voucher = { ...res, status: '' };
    const todaySplit = new Date();

    if (voucher.dateStart == null && voucher.dateEnd != null)
      if (todaySplit > voucher.dateEnd) {
        voucher.status = 'Đã quá hạn';
        return voucher;
      }

    if (voucher.dateEnd == null) {
      voucher.status = 'Vô thời hạn';
      return voucher;
    }

    if (voucher.dateStart != null) {
      if (todaySplit < voucher.dateStart) {
        voucher.status = 'Chưa quá hạn';
        return voucher;
      }

      voucher.status = 'Đang kích hoạt';
    }
    return voucher;
  }

  async findbyIdFull(id: string): Promise<Voucher> {
    return await this.voucherRepo.findOne({
      select: [
        'id',
        'partner',
        'dateCreate',
        'priceAct',
        'placeUse',
      ],
      where: { id: id },
    });
  }

  async createVoucher(
    id: string,
    voucher: createVoucher_Dto,
  ): Promise<Voucher> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const isExist = await this.voucherRepo.findOne(voucher.id);
    if (isExist != undefined) {
      errors.message['id'] = 'Mã đã tồn tại';
    }

    const newVoucher = this.voucherRepo.create({ ...voucher });
    const today = new Date();

    if (newVoucher.dateStart != null) {
      if (newVoucher.dateStart < today) {
        errors.message['dateStart'] = 'Lỗi trước hôm nay';
      }
    }

    if (newVoucher.dateStart != null && newVoucher.dateEnd != null) {
      if (newVoucher.dateStart > newVoucher.dateEnd) {
        errors.message['dateEnd'] = 'Hạn sử dụng trước ngày bắt đầu';
      }

      if (newVoucher.dateCreate > newVoucher.dateEnd) {
        errors.message['dateStart'] = 'Hạn sử dụng trước ngày tạo';
      }
    }

    if (newVoucher.dateStart == null && newVoucher.dateEnd != null) {
      if (newVoucher.dateCreate > newVoucher.dateEnd) {
        errors.message['date'] = 'Hạn sử dụng trước ngày tạo';
      }
    }

    if (newVoucher.dateStart != null && newVoucher.dateEnd == null) {
      errors.message['date'] = 'Hạn sử dụng không có';
    }

    if (Object.keys(errors.message).length != 0) {
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    newVoucher.partner = id;
    return await this.voucherRepo.save(newVoucher);
  }

  async updateUse(id: string, user: string): Promise<UpdateResult> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const voucher = await this.voucherRepo.findOne(id);
    if (voucher == undefined) {
      errors.message['id'] = 'Mã không tồn tại';
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    const contactUse = await this.contactService.findbyCode(
      id,
      'Use',
      'Voucher',
    );

    if (voucher.quantity > 0) {
      if (voucher.quantity == contactUse.length) {
        errors.message['quantity'] = 'Hết lượt sử dụng';
        throw new HttpException(errors, HttpStatus.FORBIDDEN);
      }
    }

    const contact: createContact_Dto = {
      user: user,
      type: 'Use',
      category: 'Voucher',
      code: id,
    };

    this.contactService.create(contact);

    return await this.voucherRepo.update(id, voucher);
  }

  async updateOwned(id: string, user: string): Promise<UpdateResult> {
    const errors = {
      statusCode: HttpStatus.FORBIDDEN,
      message: {},
    };

    const contactOwned = await this.contactService.findbyUser(
      user,
      'Owned',
      'Voucher',
    );

    if (contactOwned.length > 0) {
      errors.message['id'] = 'Đã sở hữu';
      throw new HttpException(errors, HttpStatus.FORBIDDEN);
    }

    const voucher = await this.voucherRepo.findOne(id);
    const contactOwn = await this.contactService.findbyCode(
      id,
      'Owned',
      'Voucher',
    );

    if (voucher.quantity > 0) {
      if (voucher.quantity == contactOwn.length) {
        errors.message['quantity'] = 'Hết lượt mua';
        throw new HttpException(errors, HttpStatus.FORBIDDEN);
      }
    }

    const contact: createContact_Dto = {
      user: user,
      type: 'Owned',
      category: 'Voucher',
      code: id,
    };

    this.contactService.create(contact);

    return null;
  }

  async updateArticle(
    id: string,
    article: updateArticle_Dto,
  ): Promise<UpdateResult> {
    return await this.voucherRepo.update(id, { ...article });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.voucherRepo.delete(id);
  }
}
