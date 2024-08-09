const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    ratings: [Number]
});

restaurantSchema.index({ location: '2dsphere' }); // Geospatial index

module.exports = mongoose.model('Restaurant', restaurantSchema);
