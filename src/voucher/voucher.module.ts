import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { Voucher } from './voucher.entity';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]), ContactModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
