const { User, Thought } = require('../models')

module.exports = {
  // GET all users
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err))
  },
  // GET a user
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v') // select all fields but the __v
      .populate('thoughts friends')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err))
  },
  // POST a new user
  createNewUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err))
  },
  // UPDATE a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedUser) =>
        !updatedUser
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(updatedUser)
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  },
  // DELETE a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: 'User and associated thoughts deleted!' })
      )
      .catch((err) => res.status(500).json(err))
  },
  // **`/api/users/:userId/friends/:friendId`**
  // - `POST` to add a new friend to a user's friend list
  addNewFriend(req, res) {
    User.findOneAndUpdate(
      // userId of the user who is adding friend
      { _id: req.params.userId },
      // takes the object id of the new friend
      { $addToSet: { friends: [req.params.friendId] } },
      { new: true }
    )
      .populate('friends', 'username')
      // .select('-__v')
      .then((userWithFriend) =>
        !userWithFriend
          ? res.status(404).json({ message: 'No user found with that id.' })
          : res.json(userWithFriend)
      )
      .catch((err) => res.status(500).json(err))
  },
  // DELETE friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      // .populate({ path: 'friends', select: '-__v' })
      // .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that id.' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err))
  },
}
