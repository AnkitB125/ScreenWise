let client = require('./dbConnection');
let db = client.db('screenWise');
const collection = db.collection('dailyUsage');

async function getChildUsage(child, callback) {
    try {
        const childName = child;
        // Query the collection
        const query = { childName: childName }; // Replace with your query
        const childData = await collection.find(query).toArray();
        if (childData) {
            return callback(null, childData, 200);
        } else {
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        return callback(err);
    }
};
    

module.exports = {
    getChildUsage
};
