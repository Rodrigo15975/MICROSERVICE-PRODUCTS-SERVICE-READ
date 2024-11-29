import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import {
  PRODUCTS_CREATE_READ,
  PRODUCTS_GET_ALL_READ,
  PRODUCTS_REMOVE_READ,
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

  @EventPattern(PRODUCTS_REMOVE_READ)
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }
}
