import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import {
  CATEGORY_CREATE_DISCOUNT_READ,
  CATEGORY_CREATE_MANY_READ,
  CATEGORY_CREATE_READ,
  CATEGORY_DELETE_DISCOUNT_READ,
  CATEGORY_DELETE_READ,
  CATEGORY_FIND_ALL_READ,
  CATEGORY_UPDATE_DISCOUNT_READ,
  CATEGORY_UPDATE_READ,
} from '../common/patternRead'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateDiscountWithCategory,
} from './dto/update-category.dto'

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern(CATEGORY_CREATE_READ)
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }
  @EventPattern(CATEGORY_CREATE_MANY_READ)
  createMany(@Payload() data: CreateCategoryDto[]) {
    return this.categoryService.createMany(data)
  }

  @EventPattern(CATEGORY_CREATE_DISCOUNT_READ)
  createDiscountWithCategory(
    @Payload() createDiscountRulesCategory: CreateCategoryDto,
  ) {
    return this.categoryService.create(createDiscountRulesCategory)
  }

  @MessagePattern(CATEGORY_FIND_ALL_READ)
  findAll() {
    return this.categoryService.findAll()
  }

  @EventPattern(CATEGORY_UPDATE_READ)
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto)
  }
  @EventPattern(CATEGORY_UPDATE_DISCOUNT_READ)
  updateDiscountWithCategory(
    @Payload() updateCategoryDto: UpdateDiscountWithCategory,
  ) {
    return this.categoryService.updateDiscountWithCategory(updateCategoryDto)
  }

  @EventPattern(CATEGORY_DELETE_READ)
  remove(@Payload() id: number) {
    return this.categoryService.remove(id)
  }

  @EventPattern(CATEGORY_DELETE_DISCOUNT_READ)
  removeDiscount(@Payload() id: number) {
    return this.categoryService.removeDiscount(id)
  }
}
