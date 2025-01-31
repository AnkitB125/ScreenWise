let client = require('../public/js/dbConnection');

let collection = client.db('screenWise').collection('logOfflineActivities');

async function postLogOfflineActivity(activity) {
    try {
        const insertedRow = await collection.insertOne(activity);
        response = 'Log Offline Activity ' + activity.offlineActivityName + ' for ' + activity.childName + ' submitted.';
        return {message: response, statusCode:201};
    } catch (err) {
        console.log(err);
        throw new Error('Database error');
    } 
};

module.exports = {
    postLogOfflineActivity
};
