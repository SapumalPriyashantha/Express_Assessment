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
        var customerTableQuery = "CREATE TABLE IF NOT EXISTS customer (" +
                                 "id VARCHAR(10) PRIMARY KEY," +
                                 "name VARCHAR(255)," +
                                 "address VARCHAR(255)," +
                                 "contactNumber VARCHAR(10))"

        connection.query(customerTableQuery, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Customer table created!");
            }
        })
    }
})

router.post('/', (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const contactNumber = req.body.contactNumber

    var query = "INSERT INTO customer (id, name, address, contactNumber) VALUES (?, ?, ?,?)";

    connection.query(query, [id, name, address,contactNumber], (err) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': 'Duplicate entry'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Customer saved successfully'
            })
        }
    })

})

router.get('/:id', (req, res) => {
    var id = req.params.id

    var query = "SELECT * FROM customer WHERE id=?";
    connection.query(query, [id],(err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Customer get successfully',
                'data' : rows
            })
        }
    })
})

router.get('/', (req, res) => {
    var query = "SELECT * FROM customer";
    connection.query(query, (err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Customer Get All successfully',
                'data' : rows
            })
        }
    })
})

router.put('/', (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const contactNumber = req.body.contactNumber

    var query = "UPDATE customer SET name=?, address=?, contactNumber=? WHERE id=?";

    connection.query(query, [name, address, contactNumber, id], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({
                'status' : '200',
                'message': 'Customer Updated Successfully'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Customer Not Fund'
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    var query = "DELETE FROM customer WHERE id=?";

    connection.query(query, [id], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({
                'status' : '200',
                'message': 'Customer Deleted Successfully'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Customer Not Fund'
            })
        }
    })
})

module.exports = router