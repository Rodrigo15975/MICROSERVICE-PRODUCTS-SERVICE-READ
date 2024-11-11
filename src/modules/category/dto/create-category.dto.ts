export class CreateCategoryDto {
  category: string
  id: number
  discountRules: {
    id: number
    categoryId: string
    discount: number
    start_date: string
    end_date: string
    is_active: true
  }
}
