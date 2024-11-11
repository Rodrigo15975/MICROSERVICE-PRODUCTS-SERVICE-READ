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
        type: Number
        unique: true
        required: true
        index: true // Aplica el índice aquí
      }
      categoryId: { type: String; required: true }
      discount: { type: Number; required: true }
      start_date: { type: String; required: true }
      end_date: { type: String; required: true }
      is_active: { type: Boolean; required: true }
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
