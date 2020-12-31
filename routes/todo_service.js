var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const _ = require("lodash");

router.post('/get_todo_list', (req, res) => {
    const db = req.app.locals.db;
    db.collection("todo_master").find({ bucketId: ObjectId(req.body.bucketId) }).toArray((err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
            return_data.data = {
                todo_list: result
            }
        }
        res.send(return_data);
    })
})

router.post('/insert_task', (req, res) => {

    const db = req.app.locals.db;
    const todo_data = {
        name: req.body.formdata.name,
        bucketId: ObjectId(req.body.formdata.bucketId),
        status: "pending",
        created_at: new Date()
    }

    db.collection("todo_master").insertOne(todo_data, (err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else if (result.insertedCount === 0) {
            return_data.error_code = "1";
            return_data.error_description = "unable to insert todo";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
        }
        res.send(return_data);
    })
});

router.post("/toggle_done", (req, res) => {
    const db = req.app.locals.db;

    const query = { _id: ObjectId(req.body.data.todoId) }
    const operation = {
        $set: {
            status: req.body.data.action === "undone" ? "pending" : "complete",
            updated_at: new Date()
        }
    }

    db.collection("todo_master").updateOne(query, operation, (err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else if (result.modifiedCount === 0) {
            return_data.error_code = "1";
            return_data.error_description = "Unable to update todo";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
        }
        res.send(return_data);
    })
})

router.post("/update_todo", (req, res) => {
    const db = req.app.locals.db;

    const query = { _id: ObjectId(req.body.formdata._id) }
    const operation = {
        $set: {
            name: req.body.formdata.name,
            status: req.body.formdata.status,
            updated_at: new Date()
        }
    };

    db.collection("todo_master").updateOne(query, operation, (err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else if (result.modifiedCount === 0) {
            return_data.error_code = "1";
            return_data.error_description = "Unable to update todo";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
        }
        res.send(return_data);
    })
});

router.post("/delete_task", (req, res) => {
    const db = req.app.locals.db;

    const query = { _id: ObjectId(req.body.taskId) }

    db.collection("todo_master").deleteOne(query, (err, result) => {
        const return_data = {};
        if (err) {
            return_data.error_code = "0";
            return_data.error_description = "Something went wrong";
        } else if (result.deletedCount === 0) {
            return_data.error_code = "1";
            return_data.error_description = "Unable to delete todo";
        } else {
            return_data.error_code = "1";
            return_data.error_description = "Success";
        }
        res.send(return_data);
    })
})


module.exports = router;