import { Module } from '@nestjs/common'
import { CategoryModule } from './modules/category/category.module'
import { ProductsModule } from './modules/products/products.module'

@Module({
  imports: [CategoryModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
