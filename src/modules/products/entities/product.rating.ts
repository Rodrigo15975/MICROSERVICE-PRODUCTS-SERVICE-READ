import { Prop } from '@nestjs/mongoose'

export class Post {
  @Prop({
    type: String,
    lowercase: true,
  })
  comments: string

  @Prop({
    type: Boolean,
    default: true,
  })
  verified: boolean

  @Prop({
    lowercase: true,
    index: true,
    type: String,
  })
  username: string

  @Prop({
    type: Number,
    index: true,
    default: 0,
  })
  userId: number

  @Prop({
    type: Number,
    index: true,
    default: 0,
  })
  rating: number
}
