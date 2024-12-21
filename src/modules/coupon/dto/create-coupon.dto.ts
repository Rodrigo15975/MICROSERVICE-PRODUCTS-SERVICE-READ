export class CreateCouponDto {
  id: number
  discount: number
  espiryDate: string | Date
  isGlobal: boolean
  isNew: boolean
  code: string
  product: {
    id: number
    product: string
  }
}
