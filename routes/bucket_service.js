var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const _ = require("lodash");


router.get('/get_buckets', (req, res) => {

    const db = req.app.locals.db;

    const query = [
        {
            $lookup: {
                from: "todo_master",
                as: "todo_list",
                let: { "bucket_id": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$bucketId", "$$bucket_id"] }
                        }
                    }
                ]
            }
        }
    ]

    db.collection("bucket_master").aggregate(query).toArray((err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
            return_data.data = {
                bucket_list: result
            }
        }
        res.send(return_data);
    })
});

router.post('/in_up_bucket', (req, res) => {
    const db = req.app.locals.db;

    if (req.body.formdata.bucketId === "0") {
        delete req.body.formdata.bucketId;
        req.body.formdata.created_at = new Date();
        db.collection("bucket_master").insertOne(req.body.formdata, (err, result) => {
            const return_data = {};
            if (err) {
                return_data.error_code = "0";
                return_data.error_description = "Something went wrong";
            } else if (result.insertedCount === 0) {
                return_data.error_code = "0";
                return_data.error_description = "Unable to insert bucket";
            } else {
                return_data.error_code = "1";
                return_data.error_description = "Success";
            }
            res.send(return_data);
        });
    } else {
        const query = { _id: ObjectId(req.body.formdata.bucketId) };
        const operation = {
            $set: {
                name: req.body.formdata.name,
                updated_at: new Date()
            }
        }
        db.collection("bucket_master").updateOne(query, operation, (err, result) => {
            const return_data = {};
            if (err) {
                return_data.error_code = "0";
                return_data.error_description = "Something went wrong";
            } else if (result.modifiedCount === 0) {
                return_data.error_code = "0";
                return_data.error_description = "Unable to update bucket";
            } else {
                return_data.error_code = "1";
                return_data.error_description = "Success";
            }
            res.send(return_data);
        })
    }
});

router.post('/get_bucket_detail', (req, res) => {
    const db = req.app.locals.db;

    db.collection("bucket_master").findOne({ _id: ObjectId(req.body.bucketId) }, (err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else if (_.isEmpty(result)) {
            return_data.error_code = "0";
            return_data.error_description = "No result found";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
            return_data.data = result;
        }
        res.send(return_data);
    })
});

router.get('/search_buckets/:term', (req, res) => {
    const db = req.app.locals.db;

    const searching_term = { $regex: `^${req.params.term}.*`, $options: 'i' };

    const query = { name: searching_term };

    db.collection("bucket_master").find(query).toArray((err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
            return_data.data = {
                bucket_list: result
            }
        }
        res.send(return_data);
    })
})

module.exports = router;