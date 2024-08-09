const express = require('express');
const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByRadius,
    getRestaurantsByRange
} = require('../controllers/restaurantController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', protect, updateRestaurant);
router.delete('/:id', protect, deleteRestaurant);
router.post('/radius', getRestaurantsByRadius);
router.post('/range', getRestaurantsByRange);

module.exports = router;
