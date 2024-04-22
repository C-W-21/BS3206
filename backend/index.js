// Package imports
const express = require('express'); 
const fs = require('fs');
const AjvJs = require('ajv');
const AjvJtd = require('ajv/dist/jtd');

// Local package imports
const routing = require('./routing.js');
const dbHandler = require('./dbHandler.js');
const config = require('./config.json');

// Configure packages
const app = express(); 
const ajvJs = new AjvJs();
const ajvJtd = new AjvJtd();

// Manage and validate JSON schemas for incoming requests with bodies
var schemas = {}
function schemaHandler(req, res, next, schemaPath) {
    const valid = schemas[schemaPath];
    if (!valid(req.body)) return res.status(400).json(valid.errors);
    next();
}

// Dynamically add all routes and apply relevant schemas as defined in routing.js
function addRoutes() {
    for (urlPath in routing) {
        for (method in routing[urlPath]) {
            // Import relevant schema and apply validation middleware function if required
            var middleware = (req, res, next) => { next() };
            const schemaPath = routing[urlPath][method].schema;
            if (schemaPath !== undefined) {
                var compiledSchema;
                if (schemaPath.endsWith(".jtd.json")) {
                    compiledSchema = ajvJtd.compile(JSON.parse(fs.readFileSync(schemaPath)));
                } else {
                    compiledSchema = ajvJs.compile(JSON.parse(fs.readFileSync(schemaPath)));
                }
                schemas[schemaPath] = compiledSchema;
    
                middleware = (req, res, next) => {
                    schemaHandler(req, res, next, schemaPath);
                };
            }
            
            // Add route
            const handler = require(routing[urlPath][method].handler);
            switch (method) {
                case "POST":
                    app.post(urlPath, middleware, handler);
                    break;
                case "GET":
                    app.get(urlPath, middleware, handler);
                    break;
                case "PUT":
                    app.put(urlPath, middleware, handler);
                    break;
                case "DELETE":
                    app.delete(urlPath, middleware, handler);
                    break;
                default:
                    console.log(`Unknown method '${method}' specified for urlPath ${urlPath}, please add this to the logic in index.js`);
                    break;
            }
        }
    }
}

// Connect to database
dbHandler.connect();

// Configure and start the application
app.use(express.json());
addRoutes();
app.listen(config.api.port, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ config.api.port) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 
