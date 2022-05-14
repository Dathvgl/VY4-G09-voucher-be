import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { findAllId_Dto, GiftCardCreate } from './giftcard.dto';
import { GiftCard } from './giftcard.entity';
import { GiftCardService } from './giftcard.service';

@Controller('giftcards')
export class GiftCardController {
  constructor(private readonly giftcardService: GiftCardService) {}

  @Get('all-id')
  findAllId(): Promise<findAllId_Dto[]> {
    return this.giftcardService.findAllId();
  }

  @Get('activate/giftcard?')
  findUse(@Query('id') id: string) {
    return this.giftcardService.findUse(id);
  }

  @Get(':id')
  get(@Param() params) {
    return this.giftcardService.findOne(params.id);
  }

  @Post('create/partner?')
  @Header('Content-Type', 'application/json')
  createPartner(
    @Query('id') id: string,
    @Body() giftcard: GiftCardCreate,
  ) {
    return this.giftcardService.createPartner(id, giftcard);
  }

  @Put()
  update(@Body() giftcard: GiftCard) {
    return this.giftcardService.update(giftcard);
  }

  @Put('activate/voucher?')
  updateUse(@Query('id') id: string, @Query('user') user: string) {
    return this.giftcardService.updateUse(id, user);
  }

  @Put('owned/voucher?')
  updateOwned(@Query('id') id: string, @Query('user') user: string) {
    return this.giftcardService.updateOwned(id, user);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.giftcardService.delete(params.id);
  }
}
