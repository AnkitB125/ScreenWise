const { postOfflineActivity, listOfflineActivity, po  } = require('../models/offlineActivity_db');

// Controller function to add offline activity
async function addOfflineActivity(req, res) {

    const activity = req.body;

    const result = postOfflineActivity(activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error adding Offline Activity record.');
        }
        res.status(statusCode).send(result);
    });
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


