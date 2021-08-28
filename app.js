const bmi = require('./calculateBmi.js')
const express = require('express')

const app = express()

// Use regex to check if client input size is a positive whole number
const isNumeric = (value) => {
    return /^\d+$/.test(value);
}

app.get('/', async (req, res) => {
    try {
        // Check if size given by client is valid
        if (!isNumeric(req.query.size)) {
            res.status(400).send('Please provide a positive whole number as size.')
            return
        }

        // Max permitted size is 100, if input is greater cap it to 100
        if (req.query.size > 100) {
            res.status(400).send('Please provide a size <= 100')
            return
        }

        // Start execution timer
        var start = Date.now()

        // Initiate asynchronous bmi calculation
        const stats = await bmi.startApp(req.query.size)

        // End the execution timer
        var end = Date.now()
        var time = end - start

        // Update execution time in the json obj
        stats['Execution Time in Milliseconds'] = time

        // Send the response to the client
        res.status(200).send(stats)
    } catch (err) {
        res.status(500).send('Internal Server Err : ' + err)
    }
})

module.exports = app