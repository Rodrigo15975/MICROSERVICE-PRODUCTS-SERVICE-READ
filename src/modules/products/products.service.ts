import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CacheService } from '../cache/cache.service'
import { HandledRpcException } from '../common/handler-errors/handle-errorst'
import { KEY_PRODUCTS_FIND_ALL } from './common/cache-key/key-cache'
import { CreateProductDto } from './dto/create-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly cacheService: CacheService,
  ) {}
  /**
   * Notification the product has been updated or created
   * @param {Product} data
   * @api private
   * @method createOrUpdate
   * @param {Product} data
   */

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
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
    } catch (error) {
      this.logger.error('Error creating/updated product in DB-READ: ', error)
      throw HandledRpcException.rpcException(
        'Error getting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  /**
   *
   */

  async findAll() {
    const data = await this.cacheService.get(KEY_PRODUCTS_FIND_ALL)
    try {
      const findAllProducts = await this.productModel
        .find()
        .select('-_id -__v')
        .exec()
      if (!data)
        await this.cacheService.set(
          KEY_PRODUCTS_FIND_ALL,
          findAllProducts,
          '1m',
        )

      return findAllProducts
    } catch (error) {
      this.logger.log('Error get all PRODUCT IN DB-READ', error)
    }
  }

  async findOne(id: number) {
    try {
      /**
       * @GET_IN_FRONT_CLIENT
       */
      // esto ira cuando toca la parte del client E-COMMERCE
      console.log(id)

      // const product = await this.productModel
      //   .findOne({
      //     id,
      //   })
      //   .select('-_id -__v')
      //   .exec()
      // if (!product)
      //   throw HandledRpcException.rpcException(
      //     'Product not found',
      //     HttpStatus.NOT_FOUND,
      //   )
      // return product
    } catch (error) {
      this.logger.log('Error get product by ID in DB-READ', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async remove(id: number) {
    try {
      await this.productModel.findOneAndDelete(
        {
          id,
        },
        {
          new: true,
        },
      )
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
      this.logger.log('Product removed successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error removing product in DB-READ: ', error)
    }
  }
}
