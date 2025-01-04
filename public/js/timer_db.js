let client = require('./dbConnection');

let collection = client.db('screenWise').collection('timer');


// Function to start the timer
async function startTimer(timer, callback) {
    try {
        // Insert timer record
        const insertedRow = await collection.insertOne(timer);
        response = 'Timer stopped at ' + timer.endDateTime + ', screen time record added for ' + timer.childName + '.';
        return callback(null, response, 201);
        
   } catch (err) {
       return callback(err);
   };
};


// Exporting the functions
module.exports = {
    startTimer
};