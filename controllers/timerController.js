
const { stopTimer } = require('../models/timer_db');

// Controller function to stop the timer and process data

async function timer(req, res) {
    const timer = req.body;
    try {
        const result = await stopTimer(timer);
        res.status(result.statusCode).send(result.message);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error stopping timer.');
    }
};

module.exports = {
    timer
}

