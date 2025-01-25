const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const PORT = 3000;

const { postOfflineActivity, listOfflineActivity, deleteOfflineActivity, updateOfflineActivity } = require('./public/js/offlineActivity_db');
const { postChild, listChildList, deleteChild, updateChild } = require('./public/js/child_db');
const { postOnlineActivity, listOnlineActivity, deleteOnlineActivity, updateOnlineActivity  } = require('./public/js/onlineActivity_db');
const { startTimer } = require('./public/js/timer_db');
const { postDailyUsage, getDailyUsage } = require('./public/js/dailyUsage_db');
const { getChildData } = require('./public/js/childDashboard_db');
const { getChildScreenTime } = require('./public/js/childScreenTime_db');
const client = require("./public/js/dbConnection"); // Import MongoDB client
const { ObjectId } = require("mongodb");

// Middleware
app.use(express.json());

// New Middlewares
app.use(require('body-parser').urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(
    require('express-session')({
        secret: 'secretKey', // Replace with a strong secret for production
        resave: false,
        saveUninitialized: true,
    })
);

const usersCollection = client.db("screenWise").collection("users");


// Middleware for redirecting from login.html to setup_parent.html
const redirectToSetup = async (req, res, next) => {
    try {
        const userCount = await usersCollection.countDocuments();
        if (userCount === 0) {
            // No user exists, redirect to setup
            return res.redirect("/setup_parent.html");
        }
        next(); // User exists, proceed to login
    } catch (err) {
        console.error("Error in redirectToSetup middleware:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Middleware for redirecting from setup_parent.html to login.html
const redirectToLogin = async (req, res, next) => {
    try {
        const userCount = await usersCollection.countDocuments();
        if (userCount > 0) {
            // User already exists, redirect to login
            return res.redirect("/login.html");
        }
        next(); // No user exists, proceed to setup
    } catch (err) {
        console.error("Error in redirectToLogin middleware:", err);
        res.status(500).send("Internal Server Error");
    }
};

const redirectToAdmin = async (req, res, next) => {
    try {
        if (req.session.user) {
            // Redirect to login page if not logged in
            return res.redirect('/indexAdmin.html');
        }
        next(); // No user exists, proceed to setup
    } catch (err) {
        console.error("Error in redirectToLogin middleware:", err);
        res.status(500).send("Internal Server Error");
    }
};


// Route for login.html with redirectToSetup middleware
app.get("/login.html", redirectToAdmin, redirectToSetup, (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// Route for setup_parent.html with redirectToLogin middleware
app.get("/setup_parent.html", redirectToAdmin, redirectToLogin, (req, res) => {
    res.sendFile(__dirname + "/public/setup_parent.html");
});

// Middleware for Authentication
app.use('/indexAdmin.html', async (req, res, next) => {
    console.log('Session:', req.session);
    try {
        const userCount = await usersCollection.countDocuments();
        if (userCount === 0) {
            // Redirect to setup page if no user exists
            return res.redirect('setup_parent.html');
        }
        if (!req.session.user) {
            // Redirect to login page if not logged in
            return res.redirect('login.html');
        }
        next(); // Allow access to indexAdmin.html if authenticated
    } catch (err) {
        console.error('Error in authentication middleware:', err);
        res.status(500).send('Internal Server Error');
    }
});

// // Route for login
// app.get("/login.html", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
// });

app.post("/login-user", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username, password });
        if (!user) {
            return res.status(401).send("Invalid credentials!");
        }
        req.session.user = { id: user._id, username: user.username }; // Save user in session
        res.status(200).send("Login successful!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/setup-user", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required!");
        }
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).send("User already exists!");
        }
        await usersCollection.insertOne({ username, password });
        res.status(201).send("Account created successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Logout route
app.post("/logout", (req, res) => {
    try {
        // Destroy the session or clear authentication token
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Logout failed");
            }
            res.status(200).send("Logout successful");
        });
    } catch (err) {
        console.error("Error in logout route:", err);
        res.status(500).send("Internal Server Error");
    }
});

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

// API endpoint to add child record list
app.get('/api/childList', (req, res) => {

    listChildList((err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Failed to get child list record.');
        }
        res.status(statusCode).send(result);
    });
});
// API endpoint to delete child record
app.delete('/api/childList/:id', (req, res) => {
    const childId = req.params.id;

    deleteChild(childId, (err, result, statusCode) => {
        if (err) {
            return res.status(500).send('Error deleting Child record.');
        }
        res.status(statusCode).send(result);
    });
});

app.put('/api/childList/:id', (req, res) => {
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
app.get('/api/childDashboard/:id', async (req, res) => {
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
// const record was const result, which threww error as argument in same block function. Unsure of purpose/link yet         
        // const record = childRecords.find(record => record.childName === childName);
        //  if (err) {
        //      console.error('Error:', err);
        //      return res.status(404).json({ message: 'Child not found' });
        //  }
        res.status(statusCode).json(result);
    });
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});