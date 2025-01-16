let client = require('./dbConnection');
let collection = client.db('screenWise').collection('timer');

async function getChildScreenTime(childName, callback) {
    try {
        // Find the child record by name
        const child = await collection.findOne({ childName: childName });

        if (child) {
            // Assuming child contains onlineActivity and offlineActivity
            const { onlineActivity, pointsUsed, minutesUsed, startDateTime, endDateTime } = child;

            // Create a response object containing the relevant information
            const response = {
                childName: child.childName,
                onlineActivity,
                pointsUsed,
                minutesUsed,
                startDateTime,
                endDateTime
            };

            // Return the response with a success status
            return callback(null, response, 200);
        } else {
            // Return "Child not found" with a 404 status
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        // Handle any database or runtime errors
        return callback(err);
    }
}

module.exports = {
    getChildScreenTime
};