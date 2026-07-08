import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandsService } from '../brands';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma';
import { IngredientResponseDto } from './dto/ingredient-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';

const productWithRelations = {
  include: {
    brand: true,
    ingredients: {
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' as const } },
    },
  },
} satisfies Prisma.ProductDefaultArgs;

type ProductWithRelations = Prisma.ProductGetPayload<
  typeof productWithRelations
>;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly brandsService: BrandsService,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      ...productWithRelations,
      orderBy: { id: 'asc' },
    });

    return products.map((x) => this.toDto(x));
  }

  async findByBrandId(brandId: number): Promise<ProductResponseDto[]> {
    await this.brandsService.findOne(brandId);

    const products = await this.prisma.product.findMany({
      where: { brandId },
      ...productWithRelations,
      orderBy: { id: 'asc' },
    });

    return products.map((x) => this.toDto(x));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      ...productWithRelations,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toDto(product);
  }

  private toDto(product: ProductWithRelations): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      brand: this.brandsService.toDto(product.brand),
      ingredients: product.ingredients.map((x): IngredientResponseDto => ({
        id: x.ingredient.id,
        name: x.ingredient.name,
        description: x.ingredient.description,
      })),
    };
  }
}
