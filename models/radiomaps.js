const mongoose = require('mongoose');

var RadiomapSchema = new mongoose.Schema({
    mFloorId: {
        type: String
    },
    mRadioMap: {
        type: [String]
    }
});

module.exports = mongoose.model("Radiomap", RadiomapSchema);