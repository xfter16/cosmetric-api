import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import { ProductsModule } from '../products';
import { ViewsController } from './views.controller';

@Module({
  imports: [BrandsModule, ProductsModule],
  controllers: [ViewsController],
})
export class ViewsModule {}
