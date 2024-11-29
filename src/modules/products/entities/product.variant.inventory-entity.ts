import { Prop } from '@nestjs/mongoose'

export class ProductVariantDto {
  @Prop({
    required: true,
    index: true,
    type: String,
  })
  color: string

  @Prop({
    required: true,
    index: true,
    type: String,
  })
  url: string
}

export class ProductInventoryDto {
  @Prop({ type: Number, index: true })
  minStock: number

  @Prop({ type: Boolean, index: true })
  stock: boolean
}
