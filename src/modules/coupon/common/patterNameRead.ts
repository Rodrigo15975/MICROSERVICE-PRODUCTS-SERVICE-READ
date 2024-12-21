const enum PATTERNAME {
  COUPON_CREATE_READ = 'coupon.create.read',
  COUPON_REMOVE_READ = 'coupon.remove.read',
  COUPON_GET_ALL_READ = 'coupon.get.all.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patternNameRead: MessagePattern = {
  COUPON_CREATE_READ: PATTERNAME.COUPON_CREATE_READ,
  COUPON_REMOVE_READ: PATTERNAME.COUPON_REMOVE_READ,
  COUPON_GET_ALL_READ: PATTERNAME.COUPON_GET_ALL_READ,
}

export const { COUPON_CREATE_READ, COUPON_REMOVE_READ, COUPON_GET_ALL_READ } =
  patternNameRead
