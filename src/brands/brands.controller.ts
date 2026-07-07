import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { BrandResponseDto } from './dto/brand-response.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List brands' })
  findAll(): Promise<BrandResponseDto[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by id' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BrandResponseDto> {
    return this.brandsService.findOne(id);
  }
}
