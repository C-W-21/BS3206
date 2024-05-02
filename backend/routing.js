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
    "/route/vehicles": {
        POST: {
            handler: "./endpoints/route/vehicles/post.js",
            schema: "./schemas/route/vehicles/post.jtd.json"
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
    "/route/archive/:metaId/:routeId/vehicles": {
        PUT: {
            handler: "./endpoints/route/archive/_metaId/_routeId/vehicles/put.js",
            schema: "./schemas/route/archive/_metaId/_routeId/vehicles/put.json"
        },
        GET: {
            handler: "./endpoints/route/archive/_metaId/_routeId/vehicles/get.js"
        }
    },
    "/login": {
        GET: {
            handler: "./endpoints/login/get.js"
        }
    },
    "/signup": {
        POST: {
            handler: "./endpoints/signup/post.js",
        },
    }
};
