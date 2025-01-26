let client = require('../public/js/dbConnection');

let collection = client.db('screenWise').collection('child');

// Function to add a new child, first checks that child with the same name doesn't already exist
async function postChild(child) {
    try {
        const existingChild = await collection.findOne({ childNameText: { $eq: child.childNameText } }); 
        if (existingChild) {
            return { message: "Child " + child.childName + " already exists.", statusCode: 409 };
        } else {
            await collection.insertOne(child);
            return { message: 'Child record ' + child.childName + ' added.', statusCode: 201 };
        }
    } catch (err) {
        console.log(err);
        throw new Error('Database error');
    }
}

//Function to list child records, used in lookup values for timer and earn points forms
async function listChild() {
    try {
        const listValues = await collection.find({}, {
            projection: {
                childName: 1,
                dailyAllowancePoints: 1,
                minutesPerPoint: 1,
                dailyLimitPoints: 1
            }
        })
        .sort({ childName: 1 })
        .toArray();

        return listValues.length > 0 ? listValues : []; // Return an empty array if no records found
    } catch (err) {
        throw new Error('Database error'); // Handle errors appropriately
    }
}

// Function to get a child by name
async function getChild(childName, callback) {
    try {
        const child = await collection.findOne({ childName: childName });
        if (child) {
            return callback(null, child, 200);
        } else {
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        return callback(err);
    }
};

///////////////////////////////////
let { ObjectId } = require('mongodb');


// Function to list all child records
async function listChildList(callback) {
    try {
        const childList = await collection.find({}).toArray();
        return callback(null, childList, 200);
    } catch (err) {
        return callback(err);
    }
}

// Function to update a child record
async function updateChild(childId, updatedData, callback) {
    try {
        const result = await collection.updateOne({ _id: new ObjectId(childId) }, { $set: updatedData });
        if (result.matchedCount > 0) {
            return callback(null, {
                "message": "Child record updated",
                "childId": childId
            }, 200);
        } else {
            return callback(null, {
                "message": "Child not found"
            }, 404);
        }
    } catch (err) {
        return callback(err);
    }
}

// Function to delete a child record
async function deleteChild(childId, callback) {
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(childId) });
        if (result.deletedCount > 0) {
            return callback(null, {
                message: "Child record deleted",
                childId: childId
            }, 200);
        } else {
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        console.log(err);
        return callback(err);
    }
}



// Exporting the functions
module.exports = {
    postChild,
    getChild,
    listChild,
    //////
    listChildList,
    updateChild,
    deleteChild,
};