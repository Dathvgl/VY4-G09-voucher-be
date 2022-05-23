import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GiftCardCreate } from './giftcard.dto';
import { GiftCard } from './giftcard.entity';
import { GiftCardService } from './giftcard.service';

@Controller('giftcards')
export class GiftCardController {
  constructor(private readonly giftcardService: GiftCardService) {}

  @Get()
  findAll(): Promise<GiftCard[]> {
    return this.giftcardService.findAll();
  }

  @Get('find/?')
  findbyService(
    @Query('service') service: string,
  ): Promise<GiftCard[]> {
    return this.giftcardService.findbyService(service);
  }

  @Get('list/user?')
  findbyUser(@Query('id') user: string) {
    return this.giftcardService.findbyUser(user);
  }

  @Get('find/giftcard?')
  findbyId(@Query('id') id: string): Promise<GiftCard> {
    return this.giftcardService.findbyId(id);
  }

  @Post('create/partner?')
  @Header('Content-Type', 'application/json')
  createPartner(
    @Query('id') id: string,
    @Body() giftcard: GiftCardCreate,
  ) {
    return this.giftcardService.createPartner(id, giftcard);
  }

  @Put('activate/giftcard?')
  updateUse(@Query('id') id: string, @Query('user') user: string) {
    return this.giftcardService.updateUse(id, user);
  }

  @Put('owned/giftcard?')
  updateOwned(@Query('id') id: string, @Query('user') user: string) {
    return this.giftcardService.updateOwned(id, user);
  }

  @Delete('delete/giftcard?')
  deleteGiftCard(@Query('id') id: string) {
    return this.giftcardService.delete(id);
  }
}
