class ProductVariantDto {
  color: string
  url: string
}

export class CreateOneVariant extends ProductVariantDto {
  id: number
  productsId: number
  key_url: string
}

class ProductInventoryDto {
  minStock: number
  stock: boolean
}

export class CreateProductDto {
  id: number

  product: string

  productVariant: ProductVariantDto[]

  price: number

  size: string[]

  gender: string

  brand: string

  description: string

  quantity: number

  total_sold: {
    total_sold: number
    id: number
  }

  is_new: boolean

  categoryId: number

  category: {
    id: number
    category: string
  }

  discount: number

  productInventory: ProductInventoryDto
}
