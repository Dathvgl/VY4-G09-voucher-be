import { Body, Controller, Delete, Get, Header, Post, Query } from '@nestjs/common';
import { createContact_Dto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  getAll() {
    return this.contactService.getAll();
  }

  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() contact: createContact_Dto) {
    return this.contactService.create(contact);
  }

  @Delete('delete/contact?')
  deleteVoucher(@Query('id') id: number) {
    return this.contactService.delete(id);
  }
}
