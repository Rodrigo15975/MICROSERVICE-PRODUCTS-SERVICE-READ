import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  ProductInventoryDto,
  ProductVariantDto,
} from './product.variant.inventory-entity'

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product extends Document {
  @Prop({
    required: true,
    index: true,
    type: Number,
    unique: true,
  })
  id: number

  @Prop({
    required: true,
    index: true,
    type: String,
    uppercase: true,
    unique: true,
  })
  product: string

  @Prop({ type: [ProductVariantDto], required: true })
  productVariant: ProductVariantDto[]

  @Prop({
    required: true,
    index: true,
    type: Number,
  })
  price: number

  @Prop({ type: [String], required: true, index: true })
  size: string[]

  @Prop({
    required: true,
    index: true,
    type: String,
    uppercase: true,
  })
  gender: string

  @Prop({
    required: true,
    index: true,
    type: String,
    uppercase: true,
  })
  brand: string

  @Prop({ required: true })
  description: string

  @Prop({
    required: true,
    index: true,
    type: Number,
  })
  quantity: number

  @Prop({
    index: true,
    type: Number,
  })
  total_sold: number

  @Prop({
    index: true,
    type: Boolean,
  })
  is_new: boolean

  @Prop({
    required: true,
    index: true,
    type: Number,
  })
  categoryId: number

  @Prop({ type: Object, required: true })
  category: {
    id: number
    category: string
  }

  @Prop({
    required: true,
    index: true,
    type: Number,
  })
  discount: number

  @Prop({ type: ProductInventoryDto, required: true })
  productInventory: ProductInventoryDto
}

export const SchemaProduct = SchemaFactory.createForClass(Product)

/**
 * @Index_Compuest_Product
 */
SchemaProduct.index({ product: 1, gender: 1, price: -1, brand: 1 })
