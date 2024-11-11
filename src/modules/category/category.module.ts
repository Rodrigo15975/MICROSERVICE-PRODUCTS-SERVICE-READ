import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { Category, CategorySchema } from './entities/category.entity'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/category'),
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
