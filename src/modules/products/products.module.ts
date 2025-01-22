import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '../cache/cache.module'
import { Category, CategorySchema } from '../category/entities/category.entity'
import { CouponModule } from '../coupon/coupon.module'
import { CouponService } from '../coupon/coupon.service'
import { Coupon, SchemaCoupon } from '../coupon/entities/coupon.entity'
import { Product, SchemaProduct } from './entities/product.entity'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { configExchange, configQueue } from './common/config-rabbit'
@Module({
  imports: [
    CouponModule,
    CacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
      envFilePath: '.env',
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('RABBITMQ_URL'),
        exchanges: configExchange,
        queues: configQueue,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: SchemaProduct,
      },
      {
        name: Coupon.name,
        schema: SchemaCoupon,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CouponService],
})
export class ProductsModule {}
