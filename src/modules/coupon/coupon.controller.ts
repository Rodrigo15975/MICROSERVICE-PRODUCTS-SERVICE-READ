import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import {
  COUPON_GET_ALL_READ,
  COUPON_CREATE_READ,
  COUPON_REMOVE_READ,
} from './common/patterNameRead'

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @EventPattern(COUPON_CREATE_READ)
  create(@Payload() createCouponDto: CreateCouponDto) {
    return this.couponService.createOrUpdate(createCouponDto)
  }

  @EventPattern(COUPON_GET_ALL_READ)
  findAll() {
    return this.couponService.findAll()
  }

  @EventPattern(COUPON_REMOVE_READ)
  remove(@Payload() id: number) {
    return this.couponService.remove(id)
  }
}
