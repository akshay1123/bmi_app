# BMI Calculator
![GitHub Action Build](https://app.travis-ci.com/akshay1123/bmi_app.svg?branch=master)

This is a Node.js based standalone backend application that calculates BMI of a large set people and categorizes them into following :
* underweight
* normal
* overweight
* moderately obese
* everely obese
* very severely obese

Focus of the application is on calculating BMI as efficiently as possible for a large dataset.
A tally of people falling into each category is returned to any client requesting this applications endpoint.

## Dataset

The Dataset consists of an array of JSON objects with following properties :

{"Gender": "Male", "HeightCm": 171, "WeightKg":  40}

For simplicity we create dataset as follows :
* Create 6 JSON objects as shown above, each object belongs to one of the BMI category mentioned.
* Repeat these 6 objects 20,000 times and store in bigData.json file.
* bigData.json file has 1,20,000 json objects.

## Specification

The application takes a positive integer as input(N) from client and reads 'N' bigData.json files parallely to calculate their bmi and categories.

### Constraints : 
  * 1 <= N <= 100
  * N is a positive integer
  
  This input can be given in following way :
  * https://ak-bmi-app.herokuapp.com/?size=1
  
  Use above URL to access the application, here N is taken input as size=N
  
  According to above constraints if 
  * N = 1,  The application reads 1.2 Lakh json objects from one file
  * N = 100, The application reads 12 Million json objects from 100 files parallely
  
  To provide best performance files are read asynchronously.
  
  ### Output
  
  * A JSON object with total tally of people in each BMI category is given to the client.

  {"underweight":20000,"normal":20000,"overweight":20000,"moderately obese":20000,"severely obese":20000,"very severely obese":20000,"Execution Time in Milliseconds":95}
  
  * This output will be shown when size=1 as one bigData.json file will have 20,000 records of people belonging to each of 6 BMI categories. (Total 1,20,000 people records in bigData.json file)
  * Notice the last property of the object "Execution Time in Milliseconds".
    This is total execution time taken by the request in milliseconds, this is shown in object to verify performance.
  
  ## Implementation
  
  Follwoing tech stack is used to implement the application :
  
  * Node.js
  * Express
  * Jest
  * Travis CI
  * Heroku
  
  Node.js handles the core logic of the application.
  Express provides a thin layer of fundamental web application features, without obscuring Node.js features.
  
  #### Core Logic :
  * According to input given by client(N), we read bigData.json 'N' times asynchronously (to focus on logic, same file is used to read multiples times!)
  * A promise is returned by each async file read, hence 'N' promises are tracked in an array.
  * On fulfillment of each promise, the statistics JSON object is returned to client along with time of execution.
  
  ## Deployment
  
  * Heroku is used for deployment of the application, it can be accessed with following URL
    * https://ak-bmi-app.herokuapp.com/?size=1
  * Continous Delivery(CD) feature is utilized from Heroku platform by linking it with github repo, each git push will deploy to Heroku automatically.
  
  ## Testing
  
  * Jest framework is used to write test for Node.js application
  * Travis CI is used to run test suite by linking it with github repo, each push will run the test suite and deployed if the build passes.
  * Tests are written to check basic functionality and specification of the application.
