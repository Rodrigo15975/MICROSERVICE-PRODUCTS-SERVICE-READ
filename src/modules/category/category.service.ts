import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateDiscountWithCategory,
} from './dto/update-category.dto'
import { Category } from './entities/category.entity'
import { CacheService } from '../cache/cache.service'
import { CATEGORY_CACHE_NAME } from './common/category-cache-name'
import { ProductsService } from '../products/products.service'

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name)
  constructor(
    @InjectModel(Category.name) private readonly schemaModel: Model<Category>,
    private readonly cacheService: CacheService,
    private readonly productService: ProductsService,
  ) {}

  async create(data: CreateCategoryDto) {
    const { id } = data
    try {
      const result = await this.schemaModel.findOneAndUpdate(
        { id },
        { $set: data },
        { upsert: true, new: true },
      )
      this.logger.log(
        `CATEGORY CREATED/UPDATED successfully in DB-READ with data: ${JSON.stringify(result)}`,
      )
      await this.cacheService.delete(CATEGORY_CACHE_NAME)
    } catch (error) {
      this.logger.fatal('Failed CREATED/UPATED Category in DB-READ: ', error)
    }
  }
  async createMany(data: CreateCategoryDto[]) {
    try {
      await this.schemaModel.insertMany(data)
      this.logger.log(
        `CREATED MANY successfully CATEGORY in DB-READ with data: ${JSON.stringify(data)}`,
      )
    } catch (error) {
      this.logger.fatal('Failed CREATED MANY Category in DB-READ: ', error)
    }
  }
  /**
   * @ALL GET CATEGORY
   * @ORDER DECS
   *
   *
   */
  async findAll() {
    const dataCache = await this.cacheService.get(CATEGORY_CACHE_NAME)
    if (dataCache) return dataCache
    const allCategoriesDB = await this.schemaModel.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          category: 1,
          createdAt: 1,
          discountRules: {
            $filter: {
              input: '$discountRules',
              as: 'rule',
              cond: { $eq: ['$$rule.is_active', true] },
            },
          },
        },
      },
      { $sort: { id: -1 } },
    ])
    await this.cacheService.set(CATEGORY_CACHE_NAME, allCategoriesDB, '20m')

    return allCategoriesDB
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      await this.schemaModel.findOneAndUpdate(
        {
          id,
        },
        data,
      )
      this.logger.log(
        `Updated successfully CATEGORY in DB-READ with data: ${JSON.stringify(data)}`,
      )
      await this.cacheService.delete(CATEGORY_CACHE_NAME)
    } catch (error) {
      this.logger.fatal('Failed Updated Category in DB-READ: ', error)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * @Updated  DISCOUNT WITH CATEGORY
   * @RETURN no return
   *
   */
  async updateDiscountWithCategory(data: UpdateDiscountWithCategory) {
    const { id } = data
    try {
      await this.schemaModel.updateOne(
        {
          'discountRules.id': id,
        },
        {
          $set: {
            'discountRules.$': data,
          },
        },
      )
      this.logger.log(
        `Updated successfully DISCOUNT with CATEGORY in DB-READ with data: ${JSON.stringify(data)}`,
      )
      await this.cacheService.delete(CATEGORY_CACHE_NAME)
    } catch (error) {
      this.logger.fatal(
        'Failed Updated DISCOUNT with CATEGORY in DB-READ: ',
        error,
      )
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {
      await this.schemaModel.findOneAndDelete({
        id,
      })
      await this.productService.findOneAndDeleteCategorieOfProduct(id)
      this.logger.log(
        `deleted successfully CATEGORY in DB-READ with id: ${JSON.stringify(id)}`,
      )
      await this.cacheService.delete(CATEGORY_CACHE_NAME)
    } catch (error) {
      this.logger.fatal('Failed DELETED Category in DB-READ: ', error)
      throw new InternalServerErrorException(error)
    }
  }
  async removeDiscount(id: number) {
    try {
      await this.schemaModel.updateOne(
        {
          'discountRules.id': id,
        },
        {
          $pull: {
            discountRules: { id },
          },
        },
      )
      await this.cacheService.delete(CATEGORY_CACHE_NAME)
      this.logger.log(
        `Deleted with Discount successfully CATEGORY in DB-READ with id: ${JSON.stringify(id)}`,
      )
    } catch (error) {
      this.logger.fatal(
        'Failed create Discount with Category in DB-READ: ',
        error,
      )
      throw new InternalServerErrorException(error)
    }
  }
}
