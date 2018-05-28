var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var db_name = "mazedb";

var _ = require("lodash");


var router = express.Router();

router.get("/", function (req, res) {
    return res.status(200).json({code: 200, message: "API"})
})

// ------------------- BUILDINGS -----------------------

// CREATE BUILDINGS
router.post("/buildings", function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myobj = req.body;
        dbo.collection("buildings").insertOne(myobj, function(err, result) {
            if (err) {
                return res.status(500).json({code:500, message: err})
            }else{
                return res.status(200).json({code: 200, message: "CREATE BUILDINGS WITH PARAMS"});
            }

            db.close();
        });
    });

});

// REGEX SEARCH
router.get("/buildings/search/", function (req, res, next) {
    if(isEmptyObject(req.query)) {
        next()
    }else {
        var search = req.query.name;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("buildings").find( {mBuildingName:  new RegExp(search, 'i')}).toArray(function(err, result) {
                if (err) {
                    return res.status(500).json({code:500, message: err})
                }else {
                    db.close();
                    return res.status(200).send(result);
                }
            });
        });

    }
});

// SEARCH BY FP
router.post("/buildings/search", function (req, res) {
    var search_arr = req.body;
    console.log(search_arr);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection("buildings").find({mAvailableAccessPoints: { $all : search_arr}}).toArray(function (err, item) {
            console.log(item);
            if(err)  {
                return res.status(400).json({code:400, message: err});
            }else{
                
                return res.status(200).json(item);
            }
        })
    })

})

// READ BUILDINGS FROM ID
router.get("/buildings/:id", function (req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection("buildings").findOne({mBuildingId: req.params.id}, function(err, result) {
            if (err) {
                return res.status(500).json({code: 500, message: err})
            }else if(result == null){
                return res.status(500).json({code: 500, message: "BUILDING WITH THIS ID NOT FOUND"});
            }else{
                return res.status(200).json(result);
            }
            db.close();
        });
    });

});

// UPDATE BUILDINGS FROM ID
router.put("/buildings/:id", function (req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);

        var string_data = JSON.stringify(req.body);
        var json_data = JSON.parse(string_data);

        dbo.collection("buildings").findOne({mBuildingId: req.params.id}, function(err, result) {
            if(err) {
                return res.status(500).json({code: 500, message: err.message})
            }
            if(!result) {
                return res.status(500).json({code: 500, message: "THIS OBJECT NOT FOUND"})
            }else {
                var _id = result._id;
                dbo.collection("buildings").save(
                    {
                        _id:_id,
                        mBuildingId: json_data.mBuildingId,
                        mBuildingName: json_data.mBuildingName,
                        mBuildingAddress: json_data.mBuildingAddress,
                        mType: json_data.mType,
                        mFloors: json_data.mFloors
                    }, function (err2, result2) {
                        if(err2)  {
                            return res.status(500).json({code: 500, message: err2.message})
                        }else {
                            return res.status(200).json({code: 200, message: "UPDATE BUILDS FROM ID = " + req.params.id})
                        }
                    }
                )
            }
        });
    });
});

// DELETE BUILDINGS FROM ID
router.delete("/buildings/:id", function (req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myquery = { mBuildingId: req.params.id };
        dbo.collection("buildings").deleteOne(myquery, function(err, obj) {
            db.close();
            console.log(obj.deletedCount);
            if (err) {
                return res.status(500).json({code:500, message: err})
            } else if( obj.deletedCount <= 0) {
                return res.status(500).json({code: 500, message: "OBJECT OF THIS ID NOT FOUND"})
            }
            else {
                return res.status(200).json({code: 200, message: "DELETE BUILDS FROM ID = " + req.params.id})
            }

        });
    });

});


// -----------------------------------------------------

// --------------------- FLOORS- -----------------------
// CREATE FLOORS
router.post("/floorplans", function (req, res) {
    console.log("FLOORS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myobj = req.body;
        dbo.collection("floorplans").insertOne(myobj, function(err, result) {
            if (err) {
                return res.status(500).json({code:500, message: err})
            }else{
                return res.status(200).json({code: 200, message: "CREATE BUILDINGS WITH PARAMS"});
            }

            db.close();
        });
    });
});

// READ FLOORS FROM ID
router.get("/floorplans/:id", function (req, res) {
    console.log("FLOORS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection("floorplans").findOne({mFloorId: req.params.id}, function(err, result) {
            if (err) {
                return res.status(500).json({code: 500, message: err})
            }else if(result == null){
                return res.status(500).json({code: 500, message: "FLOOR WITH THIS ID NOT FOUND"});
            }else{
                return res.status(200).json(result);
            }
            db.close();
        });
    });

});

// UPDATE FLOORS FROM ID
router.put("/floorplans/:id", function (req, res) {
    console.log("FLOORS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);

        var string_data = JSON.stringify(req.body);
        var json_data = JSON.parse(string_data);

        dbo.collection("floorplans").findOne({mFloorId: req.params.id}, function(err, result) {
            if(err) {
                return res.status(500).json({code: 500, message: err.message})
            }
            if(!result) {
                return res.status(500).json({code: 500, message: "THIS OBJECT NOT FOUND"})
            }else {
                var _id = result._id;
                dbo.collection("floorplans").save(
                    {
                        _id:_id,
                        mFloorId: json_data.mFloorId,
                        mSketch: json_data.mSketch
                    }, function (err2, result2) {
                        if(err2)  {
                            return res.status(500).json({code: 500, message: err2.message})
                        }else {
                            return res.status(200).json({code: 200, message: "UPDATE FLOOR FROM ID = " + req.params.id})
                        }
                    }
                )
            }
        });
    });

});

// DELETE FLOORS FROM ID
router.delete("/floorplans/:id", function (req, res) {
    console.log("FLOORS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myquery = { mFloorId: req.params.id };
        dbo.collection("floorplans").deleteOne(myquery, function(err, obj) {
            db.close();
            console.log(obj.deletedCount);
            if (err) {
                return res.status(500).json({code:500, message: err})
            } else if( obj.deletedCount <= 0) {
                return res.status(500).json({code: 500, message: "OBJECT OF THIS ID NOT FOUND"})
            }
            else {
                return res.status(200).json({code: 200, message: "DELETE floorplans FROM ID = " + req.params.id})
            }

        });
    });

});
// -----------------------------------------------------

// --------------------- RADIO MAPS --------------------
// CREATE RADIO MAPS
router.post("/radiomaps", function (req, res) {
    console.log("RADIO MAPS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myobj = req.body;
        dbo.collection("radiomaps").insertOne(myobj, function(err, result) {
            db.close();
            if (err) {
                return res.status(500).json({code:500, message: err})
            }else{
                return res.status(200).json({code: 200, message: "CREATE RADIO MAPS PARAMS = "+req.body})
            }

        });
    });
});

// READ RADIO MAPS FROM ID
router.get("/radiomaps/:id", function (req, res) {
    console.log("BUILDINGS");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.collection("radiomaps").findOne({mFloorId: req.params.id}, function(err, result) {
            db.close();
            if (err) {
                return res.status(500).json({code: 500, message: err})
            }else if(result == null){
                return res.status(500).json({code: 500, message: "FLOOR WITH THIS ID NOT FOUND"});
            }else{
                return res.status(200).json(result);
            }

        });
    });

});

// UPDATE RADIO MAPS FROM ID
router.put("/radiomaps/:id", function (req, res) {
    console.log("RADIO MAP");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);

        var string_data = JSON.stringify(req.body);
        var json_data = JSON.parse(string_data);

        dbo.collection("radiomaps").findOne({mFloorId: req.params.id}, function(err, result) {
            if(err) {
                return res.status(500).json({code: 500, message: err.message})
            }
            if(!result) {
                return res.status(500).json({code: 500, message: "THIS OBJECT NOT FOUND"})
            }else {
                var _id = result._id;
                dbo.collection("radiomaps").save(
                    {
                        _id:_id,
                        mFloorId: json_data.mFloorId,
                        mRadioMap: json_data.mRadioMap
                    }, function (err2, result2) {
                        if(err2)  {
                            return res.status(500).json({code: 500, message: err2.message})
                        }else {
                            return res.status(200).json({code: 200, message: "UPDATE RADIO MAPS FROM ID = " + req.params.id})
                        }
                    }
                )
            }
        });
    });

});

// DELETE RADIO MAPS FROM ID
router.delete("/radiomaps/:id", function (req, res) {
    console.log("RADIO MAP");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        var myquery = { mFloorId: req.params.id };
        dbo.collection("radiomaps").deleteOne(myquery, function(err, obj) {
            db.close();
            console.log(obj.deletedCount);
            if (err) {
                return res.status(500).json({code:500, message: err})
            } else if( obj.deletedCount <= 0) {
                return res.status(500).json({code: 500, message: "OBJECT OF THIS ID NOT FOUND"})
            }
            else {
                return res.status(200).json({code: 200, message: "DELETE RADIO MAPS FROM ID = " + req.params.id})
            }

        });
    });

});
// -----------------------------------------------------

// EXTENTION FUNCTION
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = router;