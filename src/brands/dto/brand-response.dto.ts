import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;
}
