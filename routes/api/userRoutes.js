const router = require('express').Router()
const {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
  addNewFriend,
  removeFriend,
} = require('../../controllers/userController')

// api/users
router.route('/').get(getAllUsers).post(createNewUser)

// api/users/:userId
router.route('/:userId').get(getUser).put(updateUser).delete(deleteUser)

// api/users/:userId/friends/:friendId
router
  .route('/:userId/friends/:friendId')
  .post(addNewFriend)
  .delete(removeFriend)

module.exports = router
