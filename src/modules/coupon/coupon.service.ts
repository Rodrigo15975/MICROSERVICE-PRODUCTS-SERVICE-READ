import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CacheService } from '../cache/cache.service'
import { HandledRpcException } from '../common/handler-errors/handle-errorst'
import { CACHE_KEY_COUPON_FIND_ALL } from './common/cache-key'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { Coupon } from './entities/coupon.entity'

@Injectable()
export class CouponService {
  private readonly logger: Logger = new Logger(CouponService.name)
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
    private readonly cacheService: CacheService,
  ) {}

  async createOrUpdate(data: CreateCouponDto) {
    const { id } = data
    try {
      console.log({ data })

      await this.couponModel.findOneAndUpdate(
        {
          id,
        },
        {
          $set: data,
        },
        {
          upsert: true,
          new: true,
        },
      )
      this.logger.log('Coupon created/updated successfully in DB-READ')
      await this.cacheService.delete(CACHE_KEY_COUPON_FIND_ALL)
    } catch (error) {
      this.logger.error('Error creating/updated coupon in DB-READ: ', error)
      throw HandledRpcException.rpcException(
        'Error creatings products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll() {
    try {
      const findAllCouponCache = await this.cacheService.get(
        CACHE_KEY_COUPON_FIND_ALL,
      )
      if (findAllCouponCache) return findAllCouponCache

      const findAllCoupons = await this.couponModel
        .find()
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .select('-_id -__v')
        .exec()
      await this.cacheService.set(
        CACHE_KEY_COUPON_FIND_ALL,
        findAllCoupons,
        '10m',
      )

      return findAllCoupons
    } catch (error) {
      this.logger.error('Error getting all coupons from DB-READ: ', error)
      throw HandledRpcException.rpcException(
        'Error getting all coupons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: number) {
    try {
      await this.couponModel.findOneAndDelete({
        id,
      })
      await this.cacheService.delete(CACHE_KEY_COUPON_FIND_ALL)
    } catch (error) {
      this.logger.error('Error creating/updated coupon in DB-READ: ', error)
      throw HandledRpcException.rpcException(
        'Error deleted coupon',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
