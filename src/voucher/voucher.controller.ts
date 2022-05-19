import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  updateArticle_Dto,
  createVoucher_Dto,
} from './voucher.dto';
import { Voucher } from './voucher.entity';
import { VoucherService } from './voucher.service';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('find/?')
  findbyService(
    @Query('service') service: string,
  ): Promise<Voucher[]> {
    return this.voucherService.findbyService(service);
  }

  @Get('find/use?')
  findbyUserUse(@Query('id') userId: string): Promise<Voucher[]> {
    return this.voucherService.findbyUserUse(userId);
  }

  @Get('find/owned?')
  findbyUserOwned(@Query('id') userId: string): Promise<Voucher[]> {
    return this.voucherService.findbyUserOwned(userId);
  }

  @Get('find/free?')
  findbyFree(@Query('service') service: string): Promise<Voucher[]> {
    return this.voucherService.findbyFree(service);
  }

  @Get('find/buy?')
  findbyBuy(@Query('service') service: string): Promise<Voucher[]> {
    return this.voucherService.findbyBuy(service);
  }

  @Get('find/voucher?')
  findbyId(@Query('id') id: string): Promise<Voucher> {
    return this.voucherService.findbyId(id);
  }

  @Post('create/partner?')
  createVoucher(
    @Query('id') partnerId: string,
    @Body() voucher: createVoucher_Dto,
  ) {
    return this.voucherService.createVoucher(partnerId, voucher);
  }

  @Put('activate/voucher?')
  updateUse(@Query('id') id: string, @Query('user') user: string) {
    return this.voucherService.updateUse(id, user);
  }

  @Put('owned/voucher?')
  updateOwned(@Query('id') id: string, @Query('user') user: string) {
    return this.voucherService.updateOwned(id, user);
  }

  @Put('article/voucher?')
  updateArticle(@Query('id') id: string, @Body() article: updateArticle_Dto) {
    return this.voucherService.updateArticle(id, article);
  }

  @Delete('delete/voucher?')
  deleteVoucher(@Query('id') id: string) {
    return this.voucherService.delete(id);
  }
}
