import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateDiscountWithCategory,
} from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name)
  constructor(
    @InjectModel(Category.name) private readonly schemaModel: Model<Category>,
  ) {}

  async create(data: CreateCategoryDto) {
    try {
      const result = await this.schemaModel.findOneAndUpdate(
        { id: data.id }, // Busca por ID o cualquier otro criterio único
        { $set: data }, // Los campos que deseas actualizar o establecer
        { upsert: true, new: true }, // `upsert: true` para crear si no existe, `new: true` para devolver el documento actualizado
      )
      this.logger.log(
        `CATEGORY CREATED/UPDATED successfully in DB-READ with data: ${JSON.stringify(result)}`,
      )
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
    return await this.schemaModel
      .find()
      .lean()
      .select('-_id -__v')
      .sort({ id: -1 })
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
    } catch (error) {
      this.logger.fatal('Failed Updated Category in DB-READ: ', error)
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
        // busco el doc en el discountRules que conincida con el id
        {
          'discountRules.id': id,
        },
        {
          // actualizo el doc con los datos
          $set: {
            discountRules: data,
          },
        },
      )
      this.logger.log(
        `Updated successfully DISCOUNT with CATEGORY in DB-READ with data: ${JSON.stringify(data)}`,
      )
    } catch (error) {
      this.logger.fatal(
        'Failed Updated DISCOUNT with CATEGORY in DB-READ: ',
        error,
      )
    }
  }

  async remove(id: number) {
    try {
      await this.schemaModel.findOneAndDelete({
        id,
      })
      this.logger.log(
        `deleted successfully CATEGORY in DB-READ with id: ${JSON.stringify(id)}`,
      )
    } catch (error) {
      this.logger.fatal('Failed DELETED Category in DB-READ: ', error)
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
      this.logger.log(
        `Deleted with Discount successfully CATEGORY in DB-READ with id: ${JSON.stringify(id)}`,
      )
    } catch (error) {
      this.logger.fatal(
        'Failed create Discount with Category in DB-READ: ',
        error,
      )
      // this.logger.error(error)
    }
  }
}
