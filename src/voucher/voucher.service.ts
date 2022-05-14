import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MoreThan, Repository, UpdateResult } from 'typeorm';
import {
  findAllId_Dto,
  updateArticle_Dto,
  createVoucher_Dto,
} from './voucher.dto';
import { Voucher } from './voucher.entity';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async findAllId(): Promise<findAllId_Dto[]> {
    return await this.voucherRepo.find({
      select: ['id'],
    });
  }

  async findbyService(service: string): Promise<Voucher[]> {
    const res = await this.voucherRepo.find({
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

  async findbyUserUse(userId: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      where: { userUse: userId },
    });
  }

  async findbyUserOwned(userId: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      where: { userOwned: userId },
    });
  }

  async findbyFree(service: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      where: { price: 0, service: service },
    });
  }

  async findbyBuy(service: string): Promise<Voucher[]> {
    return await this.voucherRepo.find({
      where: { price: MoreThan(0), service: service },
    });
  }

  async findbyId(id: string): Promise<Voucher> {
    const res = await this.voucherRepo.findOne({
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

  async createVoucher(
    id: string,
    voucher: createVoucher_Dto,
  ): Promise<Voucher> {
    const isExist = await this.voucherRepo.findOne(voucher.id);
    if (isExist != undefined) throw new ConflictException('Voucher đã có');

    const newVoucher = this.voucherRepo.create({ ...voucher });

    if (newVoucher.dateStart != null && newVoucher.dateEnd != null) {
      if (newVoucher.dateStart > newVoucher.dateEnd)
        throw new ConflictException('Hạn sử dụng trước ngày bắt đầu');

      if (newVoucher.dateCreate > newVoucher.dateEnd)
        throw new ConflictException('Hạn sử dụng trước ngày tạo');
    }

    if (newVoucher.dateStart == null && newVoucher.dateEnd != null)
      if (newVoucher.dateCreate > newVoucher.dateEnd)
        throw new ConflictException('Hạn sử dụng trước ngày tạo');

    if (newVoucher.dateStart != null && newVoucher.dateEnd == null)
      throw new ConflictException('Hạn sử dụng không có');

    newVoucher.partner = id;
    return await this.voucherRepo.save(newVoucher);
  }

  async updateUse(id: string, user: string): Promise<UpdateResult> {
    const voucher = await this.voucherRepo.findOne(id);
    if (voucher == undefined)
      throw new ConflictException('Voucher không tồn tại');

    if (voucher.quantity != -1)
      if (voucher.userUse.length > voucher.quantity)
        throw new ConflictException('Voucher hết lượt sử dụng');

    if (voucher.userUse.includes(user))
      throw new ConflictException('User đã sử dụng voucher');

    voucher.userUse.push(user);
    return await this.voucherRepo.update(id, voucher);
  }

  async updateOwned(id: string, user: string): Promise<UpdateResult> {
    const voucher = await this.voucherRepo.findOne(id);
    if (voucher == undefined)
      throw new ConflictException('Voucher không tồn tại');

    if (voucher.quantity != -1)
      if (voucher.userOwned.length > voucher.quantity)
        throw new ConflictException('Voucher hết lượt mua');

    if (voucher.userOwned.includes(user))
      throw new ConflictException('User đã mua voucher');

    voucher.userOwned.push(user);
    return await this.voucherRepo.update(id, voucher);
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
