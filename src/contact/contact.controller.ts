import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';
import { createContact_Dto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Get()
  getAll() {
    return this.contactService.getAll();
  }

  @Get('find?')
  findbySearch(
    @Query('type') type: string,
    @Query('category') category: string,
  ) {
    return this.contactService.findbySearch(type, category);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() contact: createContact_Dto) {
    return this.contactService.create(contact);
  }

  @Post('checkout')
  async postPayment(@Body() res: any) {
    const { token, product, voucher, user } = res;

    const customer = await this.stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    this.contactService.updatePay(voucher, user, token.card.id);

    const key = randomUUID();
    // console.log(customer);
    // console.log(token);
    const charge = this.stripe.charges.create(
      {
        amount: product.price,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      { idempotencyKey: key },
    );
  }

  @Delete('delete/contact?')
  deleteContact(@Query('id') id: number) {
    return this.contactService.delete(id);
  }
}
