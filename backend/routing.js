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
    }
};
