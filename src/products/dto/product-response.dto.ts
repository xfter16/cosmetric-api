import { ApiProperty } from '@nestjs/swagger';
import { BrandResponseDto } from '../../brands';
import { IngredientResponseDto } from './ingredient-response.dto';

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ type: BrandResponseDto })
  brand: BrandResponseDto;

  @ApiProperty({ type: [IngredientResponseDto] })
  ingredients: IngredientResponseDto[];
}
