const express = require('express')
const customer= require("./routes/customer")

const app = express();
const port = 4000;

app.use(express.json())

app.use('/customer',customer)

app.listen(port, () => {
    console.log(`app starting on ${port}`);
})
