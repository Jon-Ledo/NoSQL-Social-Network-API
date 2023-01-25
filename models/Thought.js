const { Schema, model } = require('mongoose')
const reactionSchema = require('./Reaction')
const moment = require('moment')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => moment(date).format('MMM DD, YYYY [at] hh:mm a'),
    },
    // (The user that created this thought)
    username: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true, // runs get function on query
      virtuals: true,
    },
    id: false,
  }
)

// virtual property to get number of reactions per thought
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length
})

const Thought = model('thought', thoughtSchema)

module.exports = Thought
