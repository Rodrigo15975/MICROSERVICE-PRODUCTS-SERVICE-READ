import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

import * as dotenv from 'dotenv'
dotenv.config()

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
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      autoResubscribe: true,
      retryAttempts: 5,
      retryDelay: 5000,
      reconnectOnError: (error) => {
        const targetError = 'READONLY'
        console.error(error)
        if (error.message.includes(targetError)) return true
        return true
      },
    },
  })
  const port = Number(process.env.PORT) || 4005
  await app.startAllMicroservices()
  await app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}
bootstrap()
