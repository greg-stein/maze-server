const mongoose = require('mongoose');

var BuildingSchema = new mongoose.Schema({
    // name of building
    mBuildingName: {
        type: String,
        require: [true, "mBuildingName Required"]
    },
    // adress building
    mBuildingAddress: {
        type: String,
        require: [true, "mBuildingAddress Require"]
    },
    // Type buildings
    mType: {
        type: String,
    },
    // Array floor
    mFloors: {
        type: [String],
        require: [true, "Floor must be require"]
    }
});

module.exports = mongoose.model("Building", BuildingSchema);