const { MongoClient, ServerApiVersion } = require("mongodb");
 
// establish connection to local mongoDB server 
const uri = "mongodb://localhost:27017/";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

client.connect();
module.exports = client;