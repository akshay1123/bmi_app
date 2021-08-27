const fs = require('fs')

const stats = {
    'underweight'         : 0,
    'normal'              : 0,
    'overweight'          : 0,
    'moderately obese'    : 0,
    'severely obese'      : 0,
    'very severely obese' : 0
}

const initStats = (stats) => {
    stats['underweight'] = 0
    stats['normal'] = 0
    stats['overweight'] = 0
    stats['moderately obese'] = 0
    stats['severely obese'] = 0
    stats['very severely obese'] = 0
}

const loadData = () => {
    try {
        const buffer = fs.readFileSync('bigData.json')
        const data = buffer.toString()
        return JSON.parse(data)
    } catch (e) {
        console.log(e)
        return []
    }
}

const getBmi = (weight, height) => {
    var newHeight = height / 100
    return weight / Math.pow(newHeight, 2)
}

const updateCount = (bmi) => {
    if (bmi < 18.4) {
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

const displayStats = (stats) => {
    console.log(stats)
}

const getTotalCategory = () => {
    console.time('Execution Time')
    initStats(stats)
    const userData = loadData()

    if (userData.length === 0) {
        console.log('Failed to read input!')
    } else {
        console.log('Input Read!')
        userData.forEach((item) => {
            const bmi = getBmi(item.WeightKg, item.HeightCm)
            updateCount(bmi)
        })
        displayStats(stats)
    }
    console.timeEnd('Execution Time')
    return stats
}

module.exports = {
    getTotalCategory : getTotalCategory
}