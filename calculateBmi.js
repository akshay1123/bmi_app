const fs = require('fs')

// This JSON obj is to store file names
// This file is repeatedly read for N number of times, N is taken as input from client query
const files = {
    0 : 'bigData.json'
}

// This JSON object keeps track of number of patients identified on various BMI categories
// Execution time is maintained for each request of client in the last property
const stats = {
    'underweight'                    : 0,
    'normal'                         : 0,
    'overweight'                     : 0,
    'moderately obese'               : 0,
    'severely obese'                 : 0,
    'very severely obese'            : 0,
    'Execution Time in Milliseconds' : 0
}

// Initialize the count before each client request
const initStats = (stats) => {
    stats['underweight']         = 0
    stats['normal']              = 0
    stats['overweight']          = 0
    stats['moderately obese']    = 0
    stats['severely obese']      = 0
    stats['very severely obese'] = 0
}

// Used to test application with various files
const setFile = (fileName) => {
    files[0] = fileName
}

// Calculate the BMI based of formual BMI = Weight(Kg) / (Height(m))^2
const getBmi = (weight, height) => {
    var newHeight = height / 100
    return weight / Math.pow(newHeight, 2)
}

// Classify the category of the patient based on BMI and increment the head count of that category
const updateCount = (bmi) => {
    if (bmi <= 18.4) {
        stats['underweight']++
        return
    } else if (bmi <= 24.9) {
        stats['normal']++
        return
    } else if (bmi <= 29.9) {
        stats['overweight']++
        return
    } else if (bmi <= 34.9) {
        stats['moderately obese']++
        return
    } else if (bmi <= 39.9) {
        stats['severely obese']++
        return
    } else {
        stats['very severely obese']++
        return
    }
}

// Display total statistics of the patients in logs
const displayStats = (stats) => {
    console.log(stats)
}

// Get patients data and calculate BMI and categorize them
const getTotalCategory = (data) => {
    data.forEach((item) => {
        const bmi = getBmi(item.WeightKg, item.HeightCm)
        updateCount(bmi)
    })
}

// Take binary buffer read from file and parse it into JSON obj
const parseData = (rawData) => {
    const data = rawData.toString()
    return JSON.parse(data)
}

// This API reads files asynchronously and returns a promise which is fulfilled when the read is completed
// If file name does not exist an exception will be thrown which is caught in reject of the promise
const readFileAsync = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data)
        })
    })
}

// This is entrypoint API which will be called with input size taken from client given in URL
const startApp = (len) => {

    // Initialzie the statistics of patients with every new client request
    initStats(stats)

    // As multiple files are being read parallely we trace promise from each file in this promise array
    var promises = []

    // Same file is read (len) times to keep application simple and focused on the testing of performance
    for (let i = 0; i < len; i++) {
        const task = readFileAsync(files[0])

        // Promise from each file is fulfilled if read was success
        task.then((rawData) => {

            // Parse the raw binary data inte JSON obj
            const parsedData = parseData(rawData)

            // Calculate BMI for the patients in the file and maintain the head count accordingly in stats Obj
            getTotalCategory(parsedData)
        }).catch((err) => {
            console.log('Error in parsing input file : ' + err)
            // return err
        })
        promises.push(task)
    }

    // Display the stats
    displayStats(stats)

    // A final promise is returned which will be fulfilled when all the files are processed
    return Promise.all(promises).then(() => {
        console.log("Final promise resolve!")
        return stats})
        .catch((error) => {
        console.log("Final promise reject!")
        return error
    })
}

module.exports = {
    startApp,
    setFile
}
