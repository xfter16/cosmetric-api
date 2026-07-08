import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { BrandsService } from '../brands';
import { ProductsService } from '../products/products.service';

@ApiExcludeController()
@Controller('view')
export class ViewsController {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly productsService: ProductsService,
  ) {}

  @Get('brands')
  @Render('brands')
  async brands() {
    const brands = await this.brandsService.findAll();

    return {
      title: 'Бренды',
      brands,
    };
  }

  @Get('brands/:id/products')
  @Render('brand-products')
  async brandProducts(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    const products = await this.productsService.findByBrandId(id);

    return {
      title: `Продукты: ${brand.name}`,
      brand,
      products,
    };
  }
}
