const express = require("express")
const mysql = require("mysql")
const db = require("../configs/db.configs")
const router = express.Router()

const connection = mysql.createConnection(db.database)

connection.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        var createOrderTable = "CREATE TABLE IF NOT EXISTS orders(" +
                               "orderId VARCHAR (10)," +
                               " date DATE," +
                               " customerId VARCHAR (10)," +
                               " totalCost DECIMAL (10,2) ," +
                               " CONSTRAINT PRIMARY KEY (orderId)," +
                               " CONSTRAINT FOREIGN KEY (customerId) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE)";

        connection.query(createOrderTable, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Order Table Created Successfully")
            }
        })


        var createOrderDetailTable = "CREATE TABLE IF NOT EXISTS orderDetail(" +
                                     "orderId VARCHAR (10)," +
                                     "itemCode VARCHAR (10)," +
                                     "qty VARCHAR(255)," +
                                     "price DECIMAL (10,2) ," +
                                     "CONSTRAINT PRIMARY KEY (orderId,itemCode)," +
                                     "CONSTRAINT FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE ON UPDATE CASCADE," +
                                     "CONSTRAINT FOREIGN KEY (itemCode) REFERENCES item(code) ON DELETE CASCADE ON UPDATE CASCADE)";

        connection.query(createOrderDetailTable, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Order Detail Table Created Successfully")
            }
        })
    }
})

router.post("/", (req, res) => {

    const orderId = req.body.orderId
    const date = req.body.date
    const customerId = req.body.customerId
    const totalCost = req.body.totalCost
    const orderDetail = req.body.orderDetail


    var saveOrder = "INSERT INTO orders (orderId, date, customerId, totalCost) VALUES (?,?,?,?)"

    connection.query(saveOrder, [orderId, date, customerId, totalCost], (err) => {
        if (err) {
            console.log(err)
            res.send({
                'status' : '200',
                'message': 'Place Order Failed'
            })
        } else {
            if (saveOrderDetail(res, orderDetail,orderId)) {
                res.send({
                    'status' : '200',
                    'message': 'Place Order Successfully'
                })
            }else {
                res.send({
                    'status' : '200',
                    'message': 'Place Order Failed'
                })
            }
        }
    })
})

function saveOrderDetail(res, orderDetail,orderId) {

    var saveOrderDetails = "INSERT INTO orderDetail (orderId, itemCode, qty, price) VALUES (?,?,?,?)"

    for (const od of orderDetail) {
        connection.query(saveOrderDetails, [orderId, od.code, od.qty, od.total], (err) => {
            if (err) {
                console.log(err)
                return false;
            } else {
                if (updateItemQty(od.qty, od.code)) {

                }else {
                    return false;
                }
            }
        })
    }
    return true;
}

function updateItemQty(qty,itemCode) {

    var updateItemQTY = "UPDATE item SET qty=(qty-?) WHERE code=? "

    connection.query(updateItemQTY, [qty,itemCode], (err, row) => {
        if (err) {
            console.log(err)
            return false
        }else {
            return true;
        }
    })
}

router.delete('/:id', (req, res) => {
    const orderId = req.params.id

    var query = "DELETE FROM orders WHERE orderId=?";

    connection.query(query, [orderId], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({
                'status' : '200',
                'message': 'Order Deleted Successfully'
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Order Not Fund'
            })
        }
    })
})

router.get('/', (req, res) => {
    var query = "SELECT * FROM orders";
    connection.query(query, (err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Orders Get All successfully',
                'data' : rows
            })
        }
    })
})

router.get('/getOrderDetailsByOrderId/:id', (req, res) => {
    var orderId = req.params.id

    var query = "SELECT * FROM orderDetail WHERE orderId=?";
    connection.query(query,[orderId], (err, rows) => {
        if (err) {
            res.send({
                'status' : '200',
                'message': err
            })
        } else {
            res.send({
                'status' : '200',
                'message': 'Get Order Details successfully',
                'data' : rows
            })
        }
    })
})

module.exports = router