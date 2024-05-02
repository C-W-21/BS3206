module.exports = routes = {
    "/ping": {
        GET: {
            handler: "./endpoints/ping/get.js"
        }
    },
    "/route": {
        POST: {
            handler: "./endpoints/route/post.js",
            schema: "./schemas/route/post.jtd.json"
        }
    },
    "/route/archive": {
        POST: {
            handler: "./endpoints/route/archive/post.js",
            schema: "./schemas/route/archive/post.jtd.json"
        },
        GET: {
            handler: "./endpoints/route/archive/get.js"
        }
    },
    "/route/archive/:metaId": {
        PUT: {
            handler: "./endpoints/route/archive/_metaId/put.js",
            schema: "./schemas/route/archive/_metaId/put.jtd.json"
        },
        GET: {
            handler: "./endpoints/route/archive/_metaId/get.js"
        }
    },
    "/updatevehicle":{
        POST:{
            handler:"./endpoints/updatevehicle/post.js"
        },
        GET:{
            handler:"./endpoints/updatevehicle/get.js"
        }
    },
    "/getvehiclebyid":{
        GET:{
            handler:"./endpoints/getvehiclebyid/get.js"
        }
    },
    "/createvehicle":{
        POST:{
            handler:"./endpoints/createvehicle/post.js"
        }
    },
    "/getjoinedvehicle":{
        GET:{
            handler:"./endpoints/getjoinedvehicle/get.js"
        }
    },
    "/deletevehicle":{
        GET:{
            handler:"./endpoints/deletevehicle/get.js"
        }
    }
};
