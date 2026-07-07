import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [BrandsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
