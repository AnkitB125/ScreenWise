let client = require('./dbConnection');
let collection = client.db('screenWise').collection('timer');

async function getChildScreenTime(childName, callback) {
    try {
        // Find the child record by name
        const children = await collection.find({ childName: childName }).toArray();

        if (children) {
            
          
            // Return the response with a success status
            return callback(null, children, 200);
        } else {
            // Return "Child not found" with a 404 status
            return callback(null, [], 404);
        }
    } catch (err) {
        // Handle any database or runtime errors
        return callback(err);
    }
}

module.exports = {
    getChildScreenTime
};