[<- BACK](../README.md)

# backend/

- **endpoints/**<br/>
    This directory contains the handler functions for every combination of endpoint and method. The structure convention should be as follows: `endpoints/<url/path/to/endpoint>/<method>.js` e.g. for the `http://backend:3000/ping` endpoint using the GET method, the following path is used `endpoints/ping/get.js`. Each JavaScript file should export one function which will be called when the endpoint is hit.
- **schemas/**<br/>
    For requests using methods such as POST, an optional JSON schema can be specified to validate the incoming request body. This directory structure follows the same principles as the `endpoints/` directory. The schema validatior being used is AJV which has two schema types: [JSON Schema](https://ajv.js.org/json-schema.html), and a simpler [JSON Type Definition](https://ajv.js.org/json-type-definition.html) (JTD). Files using JTD should end in `.jtd.json` to be processed by the correct validator.
- **routing.js**<br/>
    This file exports routing configuration for each endpoint. Each endpoint must be entered here with its corresponding method, handler file path, and optional schema file path. When adding an endpoint, please add the following object to the dictionary:
    ```js
    "<url/path/to/endpoint>": {
        "<METHOD>": {
            handler: "./endpoints/<path/to/handler>",
            schema: "./schemas/<path/to/schema>"
        }
    }
    ```
    This file is processed by `index.js` to build the application's routing.
- **index.js**<br/>
    This file should not need to be changed, it contains the code needed for application startup and will dynamically build the express app using the predefined routing. 
- **config.json**<br/>
    This file contains configuration for the application, please expand with more options as you need them.
- **nodemon.json**<br/>
    Nodemon is used for hot module reloading, this file defines the configuration for that service.

## Adding API Endpoints
Follow the below steps to add a new endpoint. This will go through the example of adding the `/ping` endpoint.

1. Create a file called `endpoints/ping/get.js`
1. Insert the below boilerplate contents:
    ```js
    module.exports = function handler(req, res) {
        // Your custom logic here
    }
    ```
1. If the endpoint were to recieve a JSON body in the request, a file would be created under `schemas/ping/get.jtd.json` (if using JTD) to define the schema for validating the body. The validation logic is defined in `index.js` and shouldn't need to change.
1. Add the below entry to `routing.js`:
    ```js
    "/ping": {
        GET: {
            handler: "./endpoints/ping/get.js"
        }
    }
    ```
