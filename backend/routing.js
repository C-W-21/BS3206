module.exports = routes = {
    "/route": {
        POST: {
            handler: "./endpoints/route/post.js",
            schema: "./schemas/route/post.jtd.json"
        }
    },
    "/ping": {
        GET: {
            handler: "./endpoints/ping/get.js"
        }
    },
};
