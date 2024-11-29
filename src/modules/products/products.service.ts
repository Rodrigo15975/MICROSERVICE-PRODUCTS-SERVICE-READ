import { Injectable, Logger } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Product } from './entities/product.entity'
import { Model } from 'mongoose'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly cacheService: CacheService,
  ) {}
  async create(data: CreateProductDto) {
    const { id } = data
    try {
      await this.productModel.findOneAndUpdate(
        {
          id,
        },
        {
          $set: data,
        },
        {
          upsert: true,
          new: true,
        },
      )
      this.logger.log('Product created/updated successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error creating product in DB-READ: ', error)
    }
  }

  async findAll() {
    const key = `KEY-FIND-ALL${ProductsService.name}`
    const data = await this.cacheService.get(key)
    try {
      const findAllProducts = await this.productModel
        .find()
        .select('-_id -__v')
        .exec()
      if (!data) await this.cacheService.set(key, findAllProducts, '1m')

      return findAllProducts
    } catch (error) {
      this.logger.log('Error get all PRODUCT IN DB-READ', error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto)

    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
