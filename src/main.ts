import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('MICROSERVICE  PRODUCTS READ')
    .setDescription('Products READ')
    .setVersion('1.0')
    .addTag('products')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('MICROSERVICE-PRODUCTS-READ', app, documentFactory)

  // Crear el microservicio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  })
  await app.startAllMicroservices()
  await app.listen(4005)
}
bootstrap()
