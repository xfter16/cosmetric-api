import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands';
import { ConfigurationModule } from './configuration';
import { PrismaModule } from './prisma';
import { ProductsModule } from './products';

@Module({
  imports: [ConfigurationModule, PrismaModule, BrandsModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
