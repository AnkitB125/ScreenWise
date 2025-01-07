const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const { postOfflineActivity } = require('./public/js/offlineActivity_db');
const { postChild } = require('./public/js/child_db');
const { postOnlineActivity } = require('./public/js/onlineActivity_db');
const { listChild } = require('./public/js/child_db');
const { startTimer } = require('./public/js/timer_db');
const { listOfflineActivity } = require('./public/js/offlineActivity_db');
const { listOnlineActivity } = require('./public/js/onlineActivity_db');
const { postDailyUsage } = require('./public/js/dailyUsage_db');
const { getDailyUsage } = require('./public/js/dailyUsage_db');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public folder


// API endpoint to add offline activity
app.post('/api/offline-activity', (req, res) => {
    const activity = req.body;

    postOfflineActivity(activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error adding Offline Activity record.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to list offline activity records
app.get('/api/list-offlineActivity', (req, res) => {

    listOfflineActivity((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error getting Offline Activity records.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to add child record
app.post('/api/child', (req, res) => {
    const child = req.body;

    postChild(child, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error adding Child record.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to list child records
app.get('/api/list-child', (req, res) => {

    listChild((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error getting Child records.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to add online activity
app.post('/api/online-activity', (req, res) => {
    const activity = req.body;

    postOnlineActivity(activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error adding Online Activity record.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to list online activity records
app.get('/api/list-onlineActivity', (req, res) => {

    listOnlineActivity((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error getting Online Activity records.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to add timer record
app.post('/api/timer', (req, res) => {
    const timer = req.body;

    startTimer(timer, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error stopping timer.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to add/update dailyUsage
app.post('/api/daily-usage', (req, res) => {
    const dailyUsage = req.body;

    postDailyUsage(dailyUsage, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error updating daily usage.');
        }
        res.status(statusCode).send(result);
    });
});


// API endpoint to get dailyUsage
app.get('/api/get-daily-usage', (req, res) => {
    
    getDailyUsage(req, (err, result, statusCode) => {
        if(result) {
            return res.status(statusCode).json(result); //return result
        } else {
            if (err) {
                return res.status(500).send('Error retrieving daily usage.'); //return error
            } else {
            res.status(statusCode).send(result); // return null
            }
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});