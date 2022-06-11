import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { createContact_Dto } from './contact.dto';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async getAll() {
    return await this.contactRepo.find();
  }

  async findbySearch(type: string, category: string) {
    return await this.contactRepo.find({
      where: { type: type, category: category },
    });
  }

  async findbyUser(
    user: string,
    type: string,
    category: string,
  ): Promise<Contact[]> {
    return await this.contactRepo.find({
      where: {
        user: user,
        type: type,
        category: category,
      },
    });
  }

  async findbyCode(
    code: string,
    type: string,
    category: string,
  ): Promise<Contact[]> {
    return await this.contactRepo.find({
      where: { code: code, type: type, category: category },
    });
  }

  async create(contact: createContact_Dto): Promise<createContact_Dto> {
    const newContact = this.contactRepo.create({ ...contact });
    return await this.contactRepo.save(newContact);
  }

  async updatePay(code: string, user: string, payment: string) {
    const contact = await this.contactRepo.findOne({
      where: { code, user },
    });
    contact.payment = payment;
    await this.contactRepo.update(contact.id, contact);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.contactRepo.delete(id);
  }
}
