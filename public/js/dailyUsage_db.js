let client = require('./dbConnection');

let collection = client.db('screenWise').collection('dailyUsage');


// Function to update points balance after screen time usage
async function postDailyUsage(dailyUsage, callback) {
    try {
        // Check if 
        const existingDailyUsage = await collection.findOne({ 
            childNameText: { $eq: dailyUsage.childNameText},
            startDate: { $eq: dailyUsage.startDate}
        }); 
        if(existingDailyUsage) {
            // Update
            const update = { 
                $inc: {
                    //Increment points used
                    pointsUsed: dailyUsage.pointsUsed,
                    //Reduce points available
                    pointsAvailable: -1 * dailyUsage.pointsUsed,
                    //Increment minutes used
                    minsUsed: dailyUsage.minsUsed
                }
            }; 
            const result = await collection.updateOne({ _id: existingDailyUsage._id }, update);
            response = "Points balance updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        } else {
            // Create new daily usage
            const insertedRow = await collection.insertOne(dailyUsage);
            response = "Points balanced updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    };
};

// Function to get daily usage record
async function getDailyUsage(req, callback) {

    const { childNameText, startDate } = req.query;

    try {
        // Check if daily usage record exists
        const existingDailyUsage = await collection.findOne({ 
            childNameText: { $eq: childNameText},
            startDate: { $eq: startDate}
        }); 
        if(existingDailyUsage) {
            // Return
            const response = existingDailyUsage.pointsAvailable;
            return callback(null, response, 201);
        } else {
            // Return null
            return callback(null, null, 201);
        };
    } catch (err) {
        return callback(err);
    };
};



// Exporting the functions
module.exports = {
    postDailyUsage,
    getDailyUsage
};