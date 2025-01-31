import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { Category, CategorySchema } from './entities/category.entity'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule } from '../cache/cache.module'
import { Product, SchemaProduct } from '../products/entities/product.entity'
import { ProductsService } from '../products/products.service'
import { CouponService } from '../coupon/coupon.service'
import { CouponModule } from '../coupon/coupon.module'
import { Coupon, SchemaCoupon } from '../coupon/entities/coupon.entity'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
  imports: [
    CouponModule,
    CacheModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('RABBITMQ_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Product.name,
        schema: SchemaProduct,
      },
      {
        name: Coupon.name,
        schema: SchemaCoupon,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, ProductsService, CouponService],
})
export class CategoryModule {}
