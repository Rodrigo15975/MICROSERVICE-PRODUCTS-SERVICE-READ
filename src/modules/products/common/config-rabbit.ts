import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configPublish = {
  ROUTING_EXCHANGE_CREATE_POST: 'client.create.post',
  ROUTING_ROUTINGKEY_CREATE_POST: 'client.create.post',
}

export const configQueue: RabbitMQQueueConfig[] = [
  {
    name: 'client.create.post',
    routingKey: 'client.create.post',
    exchange: 'client.create.post',
    options: {
      persistent: true,
    },
  },
]

export const configExchange: RabbitMQExchangeConfig[] = [
  {
    name: 'client.create.post',
    type: 'direct',
    options: {
      persistent: true,
    },
  },
]
