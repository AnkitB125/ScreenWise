// childController.js
const { postChild, listChild } = require('../models/child_db');

// Controller function to handle adding a child record
async function addChild(req, res) {
    const child = req.body;

    try {
        const result = await postChild(child);
        res.status(result.statusCode).send(result.message);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding Child record.');
    }
}


async function listChildRecords(req, res) {
    try {
<<<<<<< HEAD
        const childList = await listChild(); // Call the model function
        res.status(200).json(childList); // Send the list of children
=======
        const childList = await listChild(); // Call the model function 
        res.status(200).json(childList); // Send the list of child records
>>>>>>> codeReview/nonConflict_files
    } catch (err) {
        res.status(500).send('Error fetching child records.'); // Handle errors appropriately
    }
}


module.exports = {
    addChild,
    listChildRecords, 
};