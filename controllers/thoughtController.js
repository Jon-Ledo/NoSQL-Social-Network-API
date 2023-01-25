const { User, Thought, Reaction } = require('../models')

module.exports = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err))
  },
  // GET one thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .populate({ path: 'username', select: '-__v' })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that id' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      })
  },
  // POST new thought
  createNewThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { runValidators: true, new: true }
        )
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought created, but found no user with that id',
            })
          : res.json('Created a thought')
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  },
  // UPDATE a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((updatedThought) =>
        !updatedThought
          ? res.status(404).json({ message: 'No thought with that id!' })
          : res.json(updatedThought)
      )
      .catch((err) => res.status(500).json(err))
  },
  // DELETE a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((deletedThought) =>
        !deletedThought
          ? res.status(404).json({ message: 'No thought with that id' })
          : Thought.deleteMany({ _id: { $in: deletedThought.reactions } })
      )
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err))
  },

  // *** REACTIONS ***

  // POST new reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with that id.' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err))
  },

  // DELETE a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with that id.' })
          : Thought.deleteMany({ _id: { $in: thought.reactions } })
      )
      .then(() => res.json({ message: 'Reaction deleted!' }))
      .catch((err) => res.status(500).json(err))
  },
}
