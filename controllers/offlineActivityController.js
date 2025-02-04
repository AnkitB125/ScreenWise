const { postOfflineActivity, listOfflineActivity } = require('../models/offlineActivity_db');

// Controller function to add offline activity
async function addOfflineActivity(req, res) {
    const activity = req.body;
    try {
        const result = await postOfflineActivity(activity);
        res.status(result.statusCode).send(result.message);
    } catch(err) {
        console.log(err)
        res.status(500).send('Error adding Offline Activity record.');
    };
};


// Controller function to List offline activity records
async function listOfflineActivityRecords(req, res){
    try {
        const offlineActivityList = await listOfflineActivity();
        res.status(200).json(offlineActivityList);
    } catch (err) {
        res.status(500).send('Error getting Offline Activity records.');
    }
        
};


module.exports = {
    addOfflineActivity,
    listOfflineActivityRecords, 
};


