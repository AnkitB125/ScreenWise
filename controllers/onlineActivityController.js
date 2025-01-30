const { postOnlineActivity, listOnlineActivity, po  } = require('../models/onlineActivity_db');

// Controller function to add online activity
async function addOnlineActivity(req, res) {

    const activity = req.body;

    const result = postOnlineActivity(activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error adding Online Activity record.');
        }
        res.status(statusCode).send(result);
    });
};


// Controller function to List online activity records
async function listOnlineActivityRecords(req, res){
    try {
        const onlineActivityList = await listOnlineActivity();
        res.status(200).json(onlineActivityList);
    } catch (err) {
        res.status(500).send('Error getting Online Activity records.');
    }
        
};


module.exports = {
    addOnlineActivity,
    listOnlineActivityRecords, 
};


