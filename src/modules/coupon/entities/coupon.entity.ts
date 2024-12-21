import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'coupon',
  _id: false,
})
export class Coupon {
  @Prop({
    required: true,
    type: Number,
    index: true,
  })
  id: number

  @Prop({
    unique: true,
    required: true,
    index: true,
    type: String,
  })
  code: string
  @Prop({
    required: true,
    type: Number,
  })
  discount: number
  @Prop({
    required: true,
    type: Date,
  })
  espiryDate: Date | string
  @Prop({
    required: true,
    type: Boolean,
  })
  isGlobal: boolean
  @Prop({
    required: true,
    type: Boolean,
  })
  isNew: boolean
  @Prop({
    required: true,
    type: Object,
  })
  products: {
    id: number
    product: string
  }
}
export const SchemaCoupon = SchemaFactory.createForClass(Coupon)
