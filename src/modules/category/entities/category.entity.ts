import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({
  collection: 'category',
  timestamps: true,
  _id: false,
})
export class Category {
  @Prop({
    index: true,
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  })
  category: string

  @Prop({
    index: true,
    type: Number,
    unique: true,
    required: true,
  })
  id: number

  @Prop({
    type: Array<{
      id: {
        type: number
        unique: true
        required: true
        index: true
      }
      categoryId: { type: string; required: true }
      discount: { type: number; required: true }
      start_date: { type: string; required: true }
      end_date: { type: string; required: true }
      is_active: { type: boolean; required: true }
    }>,
    required: false,
  })
  discountRules: {
    id: number
    categoryId: string
    discount: number
    start_date: string
    end_date: string
    is_active: boolean
  }[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)
