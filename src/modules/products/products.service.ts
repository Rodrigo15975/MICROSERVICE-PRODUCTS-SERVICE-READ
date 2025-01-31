import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CacheService } from '../cache/cache.service'
import { HandledRpcException } from '../common/handler-errors/handle-errorst'
import { CouponService } from '../coupon/coupon.service'
import {
  KEY_PRODUCTS_FIND_ALL,
  KEY_PRODUCTS_FIND_ALL_CLIENT,
} from './common/cache-key/key-cache'
import { configPublish } from './common/config-rabbit'
import { CreateReview } from './dto/create-new-review'
import { CreateOneVariant, CreateProductDto } from './dto/create-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name)
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly cacheService: CacheService,
    private readonly couponService: CouponService,
  ) {}
  /**
   * Notification the product has been updated or created
   * @param {Product} data
   * @api private
   * @method createOrUpdate
   * @param {Product} data
   */

  async createOrUpdate(data: CreateProductDto) {
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
      await Promise.all([
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL),
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT),
      ])
    } catch (error) {
      this.logger.error('Error creating/updated product in DB-READ: ', error)
      throw new InternalServerErrorException(error.message, error.status)
    }
  }

  /**
   */
  async createOneVariant(data: CreateOneVariant) {
    try {
      const { productsId: id } = data
      await this.productModel.findOneAndUpdate(
        {
          id,
        },
        {
          $push: {
            productVariant: data,
          },
        },
        {
          new: true,
        },
      )
      await Promise.all([
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL),
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT),
      ])
      this.logger.log('One Variant created  successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error creating one Variant product', error)
      throw new InternalServerErrorException(error.message, error.status)
    }
  }

  /**
   *
   */

  async findAll() {
    try {
      const findAllProductsCache = await this.cacheService.get(
        KEY_PRODUCTS_FIND_ALL,
      )
      if (findAllProductsCache) return findAllProductsCache

      const findAllProducts = await this.productModel
        .find()
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .select('-_id -__v')
        .exec()
      await this.cacheService.set(KEY_PRODUCTS_FIND_ALL, findAllProducts, '10m')

      return findAllProducts
    } catch (error) {
      this.logger.error('Error get all PRODUCT IN DB-READ', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  @RabbitRPC({
    exchange: configPublish.ROUTING_EXCHANGE_SEND_DATA_ORDERS,
    routingKey: configPublish.ROUTING_ROUTINGKEY_SEND_DATA_ORDERS,
    queue: configPublish.ROUTING_QUEUE_SEND_DATA_ORDERS,
  })
  async getAllDataProductsForOrders() {
    try {
      return await this.findAllClient(false)
    } catch (error) {
      this.logger.error('Error get all PRODUCT IN DB-READ', error)
      return HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async findAllClient(postInclude: boolean = false) {
    try {
      const findAllProductsCache = await this.cacheService.get(
        KEY_PRODUCTS_FIND_ALL_CLIENT,
      )
      if (findAllProductsCache) return findAllProductsCache

      const findAllProducts = await this.productModel
        .find()
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .select(
          `-_id -__v -productVariant.createdAt -productVariant.updatedAt -productVariant.productsId -productVariant.updateAt  ${postInclude ? '' : '-post'}   -category.createdAt -category.updatedAt -categoryId -updatedAt`,
        )
        .exec()
      await this.cacheService.set(
        KEY_PRODUCTS_FIND_ALL_CLIENT,
        findAllProducts,
        '20m',
      )

      return findAllProducts
    } catch (error) {
      this.logger.error('Error get all PRODUCT CLIENT IN DB-READ ', error)
      return HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async findOne(id: number) {
    if (!id)
      return HandledRpcException.rpcException(
        `Id ${id} not found`,
        HttpStatus.NOT_FOUND,
      )
    try {
      const findAllProductsCache = await this.cacheService.get<
        CreateProductDto[]
      >(KEY_PRODUCTS_FIND_ALL)

      if (findAllProductsCache) {
        const product = findAllProductsCache.find(
          (product) => product.id === id,
        )
        if (!product)
          return HandledRpcException.rpcException(
            'Product not found',
            HttpStatus.NOT_FOUND,
          )
        return product
      }
      const product = await this.productModel
        .findOne({
          id,
        })
        .select('-_id -__v')
        .exec()
      if (!product)
        return HandledRpcException.rpcException(
          'Product not found',
          HttpStatus.NOT_FOUND,
        )
      return product
    } catch (error) {
      this.logger.error(`Error get product by ID in DB-READ, ID: ${id} `, error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async removeUrl(key_url: string) {
    try {
      await this.productModel.findOneAndUpdate(
        { 'productVariant.key_url': key_url },
        {
          $pull: { productVariant: { key_url } },
        },
        { new: true },
      )
      await Promise.all([
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL),
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT),
      ])
      this.logger.log('URL deleted successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error deleting URL', error)
      throw new InternalServerErrorException(error.message, error.status)
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
      await this.couponService.findOneAndDeleteCouponOfProduct(id)
      await Promise.all([
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL),
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT),
      ])
      this.logger.log('Product removed successfully in DB-READ')
    } catch (error) {
      this.logger.error(
        `Error removing product in DB-READ: ${error.message} `,
        error,
      )
      throw new InternalServerErrorException(error.message, error.status)
    }
  }

  async findOneAndDeleteCategorieOfProduct(categoryId: number) {
    try {
      await this.productModel.findOneAndDelete({
        categoryId,
      })

      this.logger.log(
        'Product deleted for CATEGORIE ID successfully in DB-READ',
        categoryId,
      )
      await Promise.all([
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL),
        this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT),
      ])
    } catch (error) {
      this.logger.error(
        `Error get product with categorie by ID in DB-READ: ${error.message} `,
        error,
      )
      throw new InternalServerErrorException(error.message, error.status)
    }
  }

  @RabbitSubscribe({
    exchange: configPublish.ROUTING_EXCHANGE_CREATE_POST,
    routingKey: configPublish.ROUTING_ROUTINGKEY_CREATE_POST,
    queue: configPublish.ROUTING_QUEUE_CREATE_POST,
  })
  async createNewReview(data: CreateReview) {
    try {
      const { productId, comments, username, rating } = data
      const product = await this.productModel.findOne({ id: productId })
      if (!product)
        throw new NotFoundException({
          message: 'Product not found',
          status: HttpStatus.NOT_FOUND,
        })

      let totalExistingRatings = 0
      let totalUsers = 0

      if (product.post.length > 0) {
        totalExistingRatings = product.post.reduce(
          (sum, review) => sum + review.countRating.rating,
          0,
        )
        totalUsers = product.post.reduce(
          (sum, review) => sum + review.countUserId.userId,
          0,
        )
      }

      const newTotalRating = Number(
        ((totalExistingRatings + rating) / (totalUsers + 1)).toFixed(1),
      )

      const updatedProduct = await this.productModel.findOneAndUpdate(
        { id: productId },
        {
          $inc: {
            'countRating.rating': rating,
            'countUserId.userId': 1,
          },

          $set: {
            'totalRating.totalRating': newTotalRating,
          },

          $push: {
            post: {
              comments,
              username,
              verified: true,
              countRating: { rating },
              countUserId: { userId: 1 },
              totalRating: { totalRating: newTotalRating },
            },
          },
        },
        { new: true, upsert: true },
      )
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL_CLIENT)
      if (!updatedProduct)
        throw new InternalServerErrorException('Failed to update product')
    } catch (error) {
      this.logger.error('Error creating createNewReview', error)
      throw new InternalServerErrorException({
        message: error.message,
        status: error.status,
      })
    }
  }
}
