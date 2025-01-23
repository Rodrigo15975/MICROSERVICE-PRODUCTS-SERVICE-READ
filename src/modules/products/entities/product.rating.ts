import { Prop } from '@nestjs/mongoose'

class CountUserId {
  @Prop({
    type: Number,
    index: true,
    default: 0,
  })
  userId: number
}

class CountRating {
  @Prop({
    type: Number,
    index: true,
    default: 0,
  })
  rating: number
}

class TotalRating {
  @Prop({
    type: Number,
    index: true,
    default: 0,
  })
  totalRating: number
}

export class Post {
  @Prop({
    type: CountRating,
  })
  countRating: CountRating
  @Prop({
    type: CountUserId,
  })
  countUserId: CountUserId
  @Prop({
    type: TotalRating,
  })
  totalRating: TotalRating

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
}
