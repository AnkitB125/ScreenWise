let client = require('./dbConnection');
let { ObjectId } = require('mongodb');

let collection = client.db('screenWise').collection('onlineActivities');

async function postOnlineActivity(activity, callback) {
    try {
        // First check if record already exists so that error message can be displayed
        const existingActivity = await collection.findOne({ onlineActivityNameText: { $eq: activity.onlineActivityNameText}}); 
        if(existingActivity) {
            response = "Activity " + activity.onlineActivityName + " already exists.";  
            return callback(null, response, 409);

        } else {
            const insertedRow = await collection.insertOne(activity);
            response = 'Activity record ' + insertedRow.insertedId + ' inserted for ' + activity.onlineActivityName;
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    } 
};

// Function to list all offline activities
async function listOnlineActivity(callback) {
    try { 
        const listValues = await collection.find({}, { projection: {onlineActivityName: 1, pointsPerHour: 1 } })
            .sort({ onlineActivityName: 1 })
            .toArray();
        if(listValues) {
            return callback(null, listValues, 201);
        } else {
            return callback(null, {
                "message": "No online activities found."
            }, 404);
        }
    } catch (err) {
        return callback(err);
    };
};


async function deleteOnlineActivity(id, callback) {
    try {
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (deleteResult.deletedCount > 0) {
            return callback(null, {
                "message": "Activity deleted successfully",
            }, 200);
        } else {
            return callback(null, {
                "message": "Activity not found"
            }, 404);
        }
    } catch (err) {
        return callback(err);
    }
}

// Need to add getOnlineActivity, updateOnlineActivity and deleteOnlineActivity


module.exports = {
    postOnlineActivity,
    listOnlineActivity
};