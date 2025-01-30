let client = require('./dbConnection');

let collection = client.db('screenWise').collection('offlineActivities');

//////////////////////////
let { ObjectId } = require('mongodb');

// Function to delete offline activity
async function deleteOfflineActivity(id, callback) {
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


// Function to update offline activity
async function updateOfflineActivity(id, updatedActivity, callback) {
    try {
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedActivity }
        );
        
        if (updateResult.matchedCount > 0) {
            return callback(null, {
                "message": "Activity updated successfully"
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



module.exports = {
    deleteOfflineActivity,
    updateOfflineActivity
};