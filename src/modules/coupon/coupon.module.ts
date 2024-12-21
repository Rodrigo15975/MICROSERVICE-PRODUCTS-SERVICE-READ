import { Module } from '@nestjs/common'
import { CouponService } from './coupon.service'
import { CouponController } from './coupon.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '../cache/cache.module'
import { Coupon, SchemaCoupon } from './entities/coupon.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    CacheModule,
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
        name: Coupon.name,
        schema: SchemaCoupon,
      },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
