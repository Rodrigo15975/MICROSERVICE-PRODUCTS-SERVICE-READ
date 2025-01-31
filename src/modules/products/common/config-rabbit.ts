import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'

export const configPublish = {
  ROUTING_EXCHANGE_CREATE_POST: 'client.create.post',
  ROUTING_ROUTINGKEY_CREATE_POST: 'client.create.post',
  ROUTING_QUEUE_CREATE_POST: 'client.create.post',

  ROUTING_EXCHANGE_SEND_DATA_ORDERS: 'client.send.data.orders',
  ROUTING_ROUTINGKEY_SEND_DATA_ORDERS: 'client.send.data.orders',
  ROUTING_QUEUE_SEND_DATA_ORDERS: 'client.send.data.orders',
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
  {
    name: 'client.send.data.orders',
    routingKey: 'client.send.data.orders',
    exchange: 'client.send.data.orders',
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
  {
    name: 'client.send.data.orders',
    type: 'direct',
    options: {
      persistent: true,
    },
  },
]
