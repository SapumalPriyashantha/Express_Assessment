const express = require("express")
const mysql = require('mysql')
const db = require("../configs/db.configs")
const router = express.Router()

const connection = mysql.createConnection(db.database)

connection.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the MySQL server');
        var itemTableQuery = "CREATE TABLE IF NOT EXISTS item (" +
                                 "code VARCHAR(10) PRIMARY KEY," +
                                 "description VARCHAR(255)," +
                                 "price VARCHAR(255)," +
                                 "qty VARCHAR(255))"

        connection.query(itemTableQuery, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Item table created!");
            }
        })
    }
})

router.post('/', (req, res) => {
    const code = req.body.code
    const description = req.body.description
    const price = req.body.price
    const qty = req.body.qty

    var query = "INSERT INTO item (code, description, price, qty) VALUES (?, ?, ?,?)";

    connection.query(query, [code, description, price,qty], (err) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': 'Duplicate entry'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Item saved successfully'
            })
        }
    })

})

router.get('/:code', (req, res) => {
    var code = req.params.code

    var query = "SELECT * FROM item WHERE code=?";
    connection.query(query, [code],(err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Item get successfully',
                'data' : rows
            })
        }
    })
})

router.get('/', (req, res) => {
    var query = "SELECT * FROM item";
    connection.query(query, (err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Item Get All successfully',
                'data' : rows
            })
        }
    })
})

router.put('/', (req, res) => {
    const code = req.body.code
    const description = req.body.description
    const price = req.body.price
    const qty = req.body.qty

    var query = "UPDATE item SET description=?, price=?, qty=? WHERE code=?";

    connection.query(query, [description, price, qty, code], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({
                'status' : '200',
                'message': 'Item Updated Successfully'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Item Not Fund'
            })
        }
    })
})

router.delete('/:code', (req, res) => {
    var code = req.params.code

    var query = "DELETE FROM item WHERE code=?";

    connection.query(query, [code], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({
                'status' : '200',
                'message': 'Item Deleted Successfully'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Item Not Fund'
            })
        }
    })
})

module.exports = router