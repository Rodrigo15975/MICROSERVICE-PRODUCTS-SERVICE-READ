import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoryDto } from './create-category.dto'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  id: number
}

export interface UpdateDiscountWithCategory
  extends Partial<Omit<CreateCategoryDto['discountRules'], 'category'>> {}
