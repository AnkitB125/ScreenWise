let client = require('../public/js/dbConnection');

let collection = client.db('screenWise').collection('offlineActivities');

async function postOfflineActivity(activity, callback) {
    try {
        // First check if record already exists so that error message can be displayed
        const existingActivity = await collection.findOne({ offlineActivityNameText: { $eq: activity.offlineActivityNameText}}); 
        if(existingActivity) {
            response = "Activity " + activity.offlineActivityName + " already exists.";  
            return callback(null, response, 409);

        } else {
            const insertedRow = await collection.insertOne(activity);
            response = 'Offline Activity ' + activity.offlineActivityName + ' added. ';
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    } 
};

// Function to list all offline activities
async function listOfflineActivity() {
    try { 
        const listValues = await collection.find({}, { projection: {offlineActivityName: 1, pointsPerHour: 1 } })
            .sort({ offlineActivityName: 1 })
            .toArray();
        return listValues.length > 0 ? listValues : []; // Return an empty array if no records found
    } catch (err) {
        console.log(err);
        throw new Error('Database error');
    };
};


module.exports = {
    postOfflineActivity,
    listOfflineActivity
};