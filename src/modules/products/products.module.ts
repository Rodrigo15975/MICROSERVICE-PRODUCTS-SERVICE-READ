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
      cache: false,
      envFilePath: '.env',
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('RABBITMQ_URL'),
        exchanges: configExchange,
        queues: configQueue,
        // connectionInitOptions: {
        //   wait: false,
        // },
        // channels: {
        //   default: {
        //     // El prefetchCount en RabbitMQ controla la cantidad de mensajes que un consumidor puede recibir y procesar simultáneamente antes de enviar un ack (confirmación) de los mensajes procesados. Esto forma parte del mecanismo de QoS (Quality of Service) en RabbitMQ.
        //     prefetchCount: 10,
        //   },
        // },
      }),
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
