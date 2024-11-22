import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoryDto } from './create-category.dto'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  id: number
}

export type UpdateDiscountWithCategory = Partial<
  Omit<CreateCategoryDto['discountRules'], 'category'>
>
