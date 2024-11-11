const enum PATTERNAME {
  CATEGORY_FIND_ALL_READ = 'category.find.all.read',

  CATEGORY_UPDATE_READ = 'category.update.read',
  CATEGORY_UPDATE_DISCOUNT_READ = 'category.update.discount.read',

  CATEGORY_CREATE_READ = 'category.create.read',
  CATEGORY_CREATE_MANY_READ = 'category.create.many.read',
  CATEGORY_CREATE_DISCOUNT_READ = 'category.create.discount.read',

  CATEGORY_DELETE_READ = 'category.delete.read',
  CATEGORY_DELETE_DISCOUNT_READ = 'category.delete.discount.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patterNameRead: MessagePattern = {
  CATEGORY_FIND_ALL_READ: PATTERNAME.CATEGORY_FIND_ALL_READ,
  CATEGORY_CREATE_READ: PATTERNAME.CATEGORY_CREATE_READ,
  CATEGORY_DELETE_READ: PATTERNAME.CATEGORY_DELETE_READ,
  CATEGORY_DELETE_DISCOUNT_READ: PATTERNAME.CATEGORY_DELETE_DISCOUNT_READ,
  CATEGORY_UPDATE_READ: PATTERNAME.CATEGORY_UPDATE_READ,
  CATEGORY_UPDATE_DISCOUNT_READ: PATTERNAME.CATEGORY_UPDATE_DISCOUNT_READ,
  CATEGORY_CREATE_MANY_READ: PATTERNAME.CATEGORY_CREATE_MANY_READ,
  CATEGORY_CREATE_DISCOUNT_READ: PATTERNAME.CATEGORY_CREATE_DISCOUNT_READ,
}

export const {
  CATEGORY_UPDATE_DISCOUNT_READ,
  CATEGORY_CREATE_DISCOUNT_READ,
  CATEGORY_FIND_ALL_READ,
  CATEGORY_DELETE_DISCOUNT_READ,
  CATEGORY_CREATE_READ,
  CATEGORY_CREATE_MANY_READ,
  CATEGORY_DELETE_READ,
  CATEGORY_UPDATE_READ,
} = patterNameRead