import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CacheService } from '../cache/cache.service'
import { HandledRpcException } from '../common/handler-errors/handle-errorst'
import { KEY_PRODUCTS_FIND_ALL } from './common/cache-key/key-cache'
import { CreateOneVariant, CreateProductDto } from './dto/create-product.dto'
import { Product } from './entities/product.entity'
import { CouponService } from '../coupon/coupon.service'

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
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
    } catch (error) {
      this.logger.error('Error creating/updated product in DB-READ: ', error)
      throw HandledRpcException.rpcException(
        'Error creatings products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
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
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
      this.logger.log('One Variant created  successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error creating one Variant product', error)
      throw HandledRpcException.rpcException(
        'Error creating one Variant product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
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
      this.logger.log('Error get all PRODUCT IN DB-READ', error)
    }
  }
  /**
   * @GET_IN_FRONT_CLIENT
   */
  // esto ira cuando toca la parte del client E-COMMERCE
  async findOne(id: number) {
    try {
      const product = await this.productModel
        .findOne({
          id,
        })
        .select('-_id -__v')
        .exec()
      if (!product)
        throw HandledRpcException.rpcException(
          'Product not found',
          HttpStatus.NOT_FOUND,
        )
      return product
    } catch (error) {
      this.logger.log('Error get product by ID in DB-READ', error)
      throw HandledRpcException.rpcException(error.message, error.status)
    }
  }

  async removeUrl(key_url: string) {
    try {
      await this.productModel.findOneAndUpdate(
        { 'productVariant.key_url': key_url }, // Filtro: busca un documento que tenga un productVariant con el key_url especificado
        {
          $pull: { productVariant: { key_url } }, // Elimina el elemento del array que tenga el key_url coincidente
        },
        { new: true }, // Devuelve el documento actualizado después de la operación
      )

      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
      this.logger.log('URL deleted successfully in DB-READ')
    } catch (error) {
      this.logger.log('Error deleting URL', error)
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
      await this.couponService.findOneAndDeleteCouponOfProduct(id)
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
      this.logger.log('Product removed successfully in DB-READ')
    } catch (error) {
      this.logger.error('Error removing product in DB-READ: ', error)
      throw HandledRpcException.rpcException(error.message, error.status)
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
      await this.cacheService.delete(KEY_PRODUCTS_FIND_ALL)
    } catch (error) {
      this.logger.log(
        'Error get product with categorie by ID in DB-READ',
        error,
      )
    }
  }
}
