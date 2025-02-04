let client = require('../public/js/dbConnection');


let collection = client.db('screenWise').collection('timer');


// Function to stop the timer
async function stopTimer(timer) {
    try {
        // Insert timer record
        const insertedRow = await collection.insertOne(timer);
        minsUsedRounded = Math.round(timer.minsUsed);
        pointsUsedFixed = timer.pointsUsed.toFixed(2);
        if(minsUsedRounded==1) { minsUsedText=' minute '} else { minsUsedText=' minutes '};
        if(pointsUsedFixed==1.00) {pointsUsedText=' point'} else { pointsUsedText=' points'};
        response = 'Timer stopped at ' + timer.endDateTime + '.\n ' + Math.round(timer.minsUsed) + minsUsedText + ' (' + timer.pointsUsed.toFixed(2) + pointsUsedText + ') used.';
        return { message: response, statusCode:201 };
        
   } catch (err) {
        console.log(err);
        throw new Error('Database error');
   };
};


// Exporting the functions
module.exports = {
    stopTimer
};