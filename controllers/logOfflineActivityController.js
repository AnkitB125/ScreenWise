const { postLogOfflineActivity} = require('../models/logOfflineActivity_db');

// Controller function to add offline activity
async function addLogOfflineActivity(req, res) {
    const activity = req.body;
    try {
        const result = await postLogOfflineActivity(activity);
        res.status(result.statusCode).send(result.message);
    } catch(err) {
        console.log(err)
        res.status(500).send('Error logging Offline Activity time.');
    };
};


module.exports = {
    addLogOfflineActivity
};


