const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const db_url = process.env.DB_CONNECT;

app.use(express.json()); //parses incoming JSON for the info the recipient is 'interested in' (JSON payloads); the other info is protocol overhead (status, etc.)
app.use(cors());

app.get("/", (req, res) => {
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      if (err) console.log(err);
      const db = dbinfo.db("Budget-App");
      db.collection("Budget-List")
        .find({})
        .toArray((err, item) => {
          //'item' = each entry in DB
          if (err) throw err;
          res.status(200).send(item);
        });
      dbinfo.close();
    }
  );
});

app.post("/", (req, res) => {
  const body = req.body;
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      //callback function for DB connection. 1st arg is an error object, in case error occurs. 2nd param is the DB object (contains DB info)
      if (err) throw err;
      const db = dbinfo.db("Budget-App"); //DB name
      db.collection("Budget-List").insertOne(body, (err, item) => {
        //inserts body rec'd from api into collection
        if (err) throw err;
        res.status(200).send(item);
      });
      dbinfo.close();
    }
  );
});

app.put("/:ID", (req, res) => {
  const body = req.body;

  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      if (err) throw err;
      const db = dbinfo.db("Budget-App");
      db.collection("Budget-List").updateMany(
        { _id: ObjectId(req.params.ID) },
        { $set: body },
        (err, item) => {
          if (err) throw err;
          res.status(200).send(item);
        }
      );
      dbinfo.close();
    }
  );
});

app.delete("/:ID", (req, res) => {
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    async (err, dbinfo) => {
      if (err) throw err;
      const db = dbinfo.db("Budget-App");
      db.collection("Budget-List").deleteOne(
        {
          _id: ObjectId(req.params.ID)
        },
        (err, item) => {
          if (err) throw err;
          res.status(200).send(item); //Sets  the HTTP status for the response. Sends HTTP response
        }
      );
      dbinfo.close();
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
