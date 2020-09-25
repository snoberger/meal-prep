# meal-prep
CS506 Project Repository

## Setup
 
  1. Install serverless
  2. Install AWS cli
  3. get secret keys from Tyler
  4. run ``` aws configure ```
  5. begin editing and creating functions in the src folder
  
## Creating a new function

  1. create a function definition that calls handler(libs/handler-lib.js)
  2. define the functionality you want to implement  
    - use libs/dynamodb-lib.js to call a dynamodb function  
    - to test on local see invoke in src/README.md  
    
## Creating new tables
  1. ask Tyler to make you an AWS account
  2. go to dynamodb service and create an on-demand table  
    - make sure you're in the correct region

## Deploying
  We will be handling deployments for the spike as needed, the command is ```serverless deploy```  
  Make sure you know who might be effected by a deployment before you run it
