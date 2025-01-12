const { MongoClient, ServerApiVersion } = require("mongodb");
 
// Replace the placeholder with your Atlas connection string
const uri = "mongodb+srv://iankit184:iRg84RYGePvAk3mr@sit725.6hnve.mongodb.net/?retryWrites=true&w=majority&appName=SIT725";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

client.connect();
module.exports = client;