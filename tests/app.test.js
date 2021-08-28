const request = require('supertest')
const app = require('../app')
const calculateBmi = require('../calculateBmi')

jest.setTimeout(20000)

test('Test with valid size', async () => {
    await request(app).get('/' + '?size=1').expect(200)
})

test('Test with empty size', async () => {
    await request(app).get('/').expect(400)
})

test('Test with string size', async () => {
    await request(app).get('/' + '?size=aa').expect(400)
})

test('Test with float size', async () => {
    await request(app).get('/' + '?size=4.4').expect(400)
})

test('Test with negative size', async () => {
    await request(app).get('/' + '?size=-4').expect(400)
})

test('Test with size > 100', async () => {
    await request(app).get('/' + '?size=101').expect(400)
})

test('Test with custom input file', async () => {
    calculateBmi.setFile('./tests/input.json')
    var obj = {"underweight":1,"normal":1,
               "overweight":1,
               "moderately obese":1,
               "severely obese":1,
               "very severely obese":1}

    await request(app)
        .get('/' + '?size=1')
        .expect(200)
        .then((res) => {
            expect(res.body.toString()).toMatch(obj.toString())
        })
})

test('Test with wrong format file', async () => {
    calculateBmi.setFile('./tests/empty.json')
    var obj = {"underweight":0,"normal":0,
               "overweight":0,
               "moderately obese":0,
               "severely obese":0,
               "very severely obese":0}

    await request(app)
        .get('/' + '?size=1')
        .expect(200)
        .then((res) => {
            expect(res.body.toString()).toMatch(obj.toString())
        })
})

test('Test application with max load', async () => {
    calculateBmi.setFile('bigData.json')
    jest.setTimeout(20000)
    var obj = {"underweight":2000000,"normal":2000000,
               "overweight":2000000,
               "moderately obese":2000000,
               "severely obese":2000000,
               "very severely obese":2000000}

    await request(app)
        .get('/' + '?size=100')
        .expect(200)
        .then((res) => {
            expect(res.body.toString()).toMatch(obj.toString())
        })
})
