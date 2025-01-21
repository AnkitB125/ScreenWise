const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const { postOfflineActivity, listOfflineActivity, deleteOfflineActivity, updateOfflineActivity } = require('./public/js/offlineActivity_db');
const { postChild, listChildren, deleteChild, updateChild } = require('./public/js/child_db');
const { postOnlineActivity, listOnlineActivity, deleteOnlineActivity, updateOnlineActivity  } = require('./public/js/onlineActivity_db');
const { startTimer } = require('./public/js/timer_db');
const { postDailyUsage, getDailyUsage } = require('./public/js/dailyUsage_db');
const { getChildData } = require('./public/js/childDashboard_db');
const { getChildScreenTime } = require('./public/js/childScreenTime_db');

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



app.delete('/api/delete-offlineActivity/:id', (req, res) => {
    const id = req.params.id;

    deleteOfflineActivity(id, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error deleting Offline Activity record.');
        }
        res.status(statusCode).send(result);
    });
});

app.put('/api/update-offlineActivity/:id', (req, res) => {
    const id = req.params.id;
    const activity = req.body;

    updateOfflineActivity(id, activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send({
                "message": "Error updating offline activity"
            });
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

// API endpoint to add child record
app.get('/api/children', (req, res) => {

    listChildren((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Failed to get children.');
        }
        res.status(statusCode).send(result);
    });
});
// API endpoint to delete child record
app.delete('/api/children/:id', (req, res) => {
    const childId = req.params.id;

    deleteChild(childId, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error deleting Child record.');
        }
        res.status(statusCode).send(result);
    });
});

app.put('/api/children/:id', (req, res) => {
    const childId = req.params.id;
    const child = req.body;
    updateChild(childId, child, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error deleting Child record.');
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

// list
app.get('/api/list-onlineActivity', (req, res) => {

    listOnlineActivity((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error getting Online Activity records.');
        }
        res.status(statusCode).send(result);
    });
});

//
app.delete('/api/delete-onlineActivity/:id', (req, res) => {
    const id = req.params.id;

    deleteOnlineActivity(id, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error deleting Online Activity record.');
        }
        res.status(statusCode).send(result);
    });
});

// update online activity
app.put('/api/update-onlineActivity/:id', (req, res) => {
    const id = req.params.id;
    const activity = req.body;

    updateOnlineActivity(id, activity, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send({
                "message": "Error updating online activity"
            });
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


//API  endpoint to get child data by ID for the dashboard
app.get('/api/childdasboard/:id', async (req, res) => {
    const id = req.params.id;

    getChildData(id, (err, result, statusCode) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(statusCode).json(result);
    });
});
//API  endpoint to get child screen usage time usage
app.get('/api/screentimeusage', (req, res) => {
    const childName = req.query.childName;


    getChildScreenTime(childName, (err, result, statusCode) => {
        // const result = childRecords.find(record => record.childName === childName);
        // if (err) {
        //     console.error('Error:', err);
        //     return res.status(404).json({ message: 'Child not found' });
        // }
        res.status(statusCode).json(result);
    });
  });


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});