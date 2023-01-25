const connection = require('../config/connection')
const { User, Thought } = require('../models')
const {
  getRandomName,
  getRandomThought,
  getReactions,
  getRandomArrItem,
} = require('./data')

connection.on('error', (err) => err)

connection.once('open', async () => {
  console.log('connected')
  await User.deleteMany({})
  await Thought.deleteMany({})

  const users = []
  const thoughts = []

  // Users seeding
  for (let i = 0; i < 20; i++) {
    const username = getRandomName()

    users.push({
      username,
      email: `${username}@gmail.com`,
    })
  }

  await User.collection.insertMany(users)

  // Thoughts seeding
  await User.collection.find().forEach((doc) => {
    const userId = doc._id

    const thoughtText = getRandomThought()
    const randomUser = getRandomArrItem(users)
    const newThought = {
      thoughtText,
      username: userId,
      reactions: [...getReactions(3, randomUser.username)],
    }
    thoughts.push(newThought)
  })

  await Thought.collection.insertMany(thoughts)

  console.table(users)
  console.table(thoughts)
  process.exit(0)
})
