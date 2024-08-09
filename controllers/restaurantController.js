const Restaurant = require('../models/restaurantModel');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private
exports.createRestaurant = async (req, res) => {
    const { name, description, latitude, longitude, ratings } = req.body;

    try {
        const restaurant = await Restaurant.create({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            ratings: ratings || []
        });

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a restaurant by ID
// @route   PUT /api/restaurants/:id
// @access  Private
exports.updateRestaurant = async (req, res) => {
    const { name, description, latitude, longitude, ratings } = req.body;

    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        if (latitude && longitude) {
            restaurant.location.coordinates = [longitude, latitude];
        }
        if (ratings) {
            restaurant.ratings = ratings;
        }

        const updatedRestaurant = await restaurant.save();
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a restaurant by ID
// @route   DELETE /api/restaurants/:id
// @access  Private
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        await restaurant.remove();
        res.json({ message: 'Restaurant removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get restaurants within a radius
// @route   POST /api/restaurants/radius
// @access  Public
exports.getRestaurantsByRadius = async (req, res) => {
    const { latitude, longitude, radius } = req.body;

    try {
        const restaurants = await Restaurant.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 6378.1] // Convert radius to radians
                }
            }
        });

        res.json(restaurants.map(restaurant => ({
            name: restaurant.name,
            description: restaurant.description,
            location: {
                latitude: restaurant.location.coordinates[1],
                longitude: restaurant.location.coordinates[0]
            },
            averageRating: restaurant.ratings.length > 0 ? (restaurant.ratings.reduce((a, b) => a + b, 0) / restaurant.ratings.length) : 0,
            numberOfRatings: restaurant.ratings.length
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get restaurants within a distance range
// @route   POST /api/restaurants/range
// @access  Public
exports.getRestaurantsByRange = async (req, res) => {
    const { latitude, longitude, minimumDistance, maximumDistance } = req.body;

    try {
        const restaurants = await Restaurant.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [longitude, latitude],
                        maximumDistance / 6378.1
                    ]
                }
            }
        });

        const filteredRestaurants = restaurants.filter(restaurant => {
            const distance = getDistanceFromLatLonInKm(latitude, longitude, restaurant.location.coordinates[1], restaurant.location.coordinates[0]);
            return distance >= minimumDistance / 1000 && distance <= maximumDistance / 1000;
        });

        res.json(filteredRestaurants.map(restaurant => ({
            name: restaurant.name,
            description: restaurant.description,
            location: {
                latitude: restaurant.location.coordinates[1],
                longitude: restaurant.location.coordinates[0]
            },
            averageRating: restaurant.ratings.length > 0 ? (restaurant.ratings.reduce((a, b) => a + b, 0) / restaurant.ratings.length) : 0,
            numberOfRatings: restaurant.ratings.length
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Utility function to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
