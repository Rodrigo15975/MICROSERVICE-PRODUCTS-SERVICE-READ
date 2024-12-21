import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @EventPattern('createCoupon')
  create(@Payload() createCouponDto: CreateCouponDto) {
    return this.couponService.createOrUpdate(createCouponDto)
  }

  @EventPattern('findAllCoupon')
  findAll() {
    return this.couponService.findAll()
  }

  @EventPattern('removeCoupon')
  remove(@Payload() id: number) {
    return this.couponService.remove(id)
  }
}
