let client = require('../public/js/dbConnection');

let collection = client.db('screenWise').collection('onlineActivities');

async function postOnlineActivity(activity) {
    try {
        // First check if record already exists so that error message can be displayed
        const existingActivity = await collection.findOne({ onlineActivityNameText: { $eq: activity.onlineActivityNameText}}); 
        if(existingActivity) {
            response = "Activity " + activity.onlineActivityName + " already exists.";  
            return {message: response, statusCode:409}
        } else {
            const insertedRow = await collection.insertOne(activity);
            response = 'Online Activity ' + activity.onlineActivityName + ' added. ';
            return {message:response,statusCode:201};
        };
    } catch (err) {
        console.log(err);
        throw new Error('Database error');
    } 
};

// Function to list all online activities
async function listOnlineActivity() {
    try { 
        const listValues = await collection.find({}, { projection: {onlineActivityName: 1, pointsPerHour: 1 } })
            .sort({ onlineActivityName: 1 })
            .toArray();
        return listValues.length > 0 ? listValues : []; // Return an empty array if no records found
    } catch (err) {
        console.log(err);
        throw new Error('Database error');
    };
};


module.exports = {
    postOnlineActivity,
    listOnlineActivity
};