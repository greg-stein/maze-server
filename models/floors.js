const mongoose = require('mongoose');

var FloorSchema = new mongoose.Schema({
    // name of floor
    mFloorName: {
        type: String
    },
    mSketch: {
        type: [String]
    }
});

module.exports = mongoose.model("Floor", FloorSchema);