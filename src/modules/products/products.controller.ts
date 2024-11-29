import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import {
  PRODUCTS_CREATE_READ,
  PRODUCTS_GET_ALL_READ,
} from './common/patternRead'

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(PRODUCTS_CREATE_READ)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @MessagePattern(PRODUCTS_GET_ALL_READ)
  findAll() {
    return this.productsService.findAll()
  }

  @MessagePattern('findOneProduct')
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id)
  }

  @MessagePattern('updateProduct')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto)
  }

  @MessagePattern('removeProduct')
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }
}
