import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '../generated/prisma/client';
import { PrismaService } from '../prisma';
import { BrandResponseDto } from './dto/brand-response.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BrandResponseDto[]> {
    const brands = await this.prisma.brand.findMany({
      orderBy: { id: 'asc' },
    });

    return brands.map((x) => this.toDto(x));
  }

  async findOne(id: number): Promise<BrandResponseDto> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return this.toDto(brand);
  }

  toDto(brand: Brand): BrandResponseDto {
    return {
      id: brand.id,
      name: brand.name,
      description: brand.description,
    };
  }
}
