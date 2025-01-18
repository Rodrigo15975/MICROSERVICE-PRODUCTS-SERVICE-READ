import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ProductsService } from './products.service'
import { CreateOneVariant, CreateProductDto } from './dto/create-product.dto'
import {
  PRODUCTS_CREATE_ONE_VARIANT_READ,
  PRODUCTS_CREATE_READ,
  PRODUCTS_GET_ALL_READ,
  PRODUCTS_GET_ALL_READ_CLIENT,
  PRODUCTS_GET_ONE,
  PRODUCTS_REMOVE_READ,
  PRODUCTS_REMOVE_SIZE_READ,
  PRODUCTS_REMOVE_URL_READ,
} from './common/patternRead'

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @EventPattern(PRODUCTS_CREATE_READ)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.createOrUpdate(createProductDto)
  }

  @EventPattern(PRODUCTS_CREATE_ONE_VARIANT_READ)
  createOneVariant(@Payload() createOneVariant: CreateOneVariant) {
    return this.productsService.createOneVariant(createOneVariant)
  }

  @MessagePattern(PRODUCTS_GET_ALL_READ)
  findAll() {
    return this.productsService.findAll()
  }

  @MessagePattern(PRODUCTS_GET_ALL_READ_CLIENT)
  findAllClient() {
    return this.productsService.findAllClient()
  }

  @MessagePattern(PRODUCTS_GET_ONE)
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id)
  }

  @EventPattern(PRODUCTS_REMOVE_READ)
  remove(@Payload() id: number) {
    return this.productsService.remove(id)
  }

  /**
   * @DeteleUrl
   */
  @EventPattern(PRODUCTS_REMOVE_URL_READ)
  removeUrl(@Payload() key_url: string) {
    return this.productsService.removeUrl(key_url)
  }
  /**
   * @DeteleUrl
   */
  @EventPattern(PRODUCTS_REMOVE_SIZE_READ)
  removeOneSize(@Payload() data: CreateProductDto) {
    return this.productsService.createOrUpdate(data)
  }
}
