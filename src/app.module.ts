import { Module } from '@nestjs/common'
import { CategoryModule } from './modules/category/category.module'
import { ProductsModule } from './modules/products/products.module'
import { CacheModule } from './modules/cache/cache.module'
import { CouponModule } from './modules/coupon/coupon.module'

@Module({
  imports: [CategoryModule, ProductsModule, CacheModule, CouponModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
