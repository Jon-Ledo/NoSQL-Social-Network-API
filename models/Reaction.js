const { Schema, Types } = require('mongoose')

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    // username: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => moment(date).format('MMM DD, YYYY [at] hh:mm a'),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
)

module.exports = reactionSchema
