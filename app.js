const redis = require("redis");
const client = redis.createClient();

client.on('connect', function () {
    console.log('connected');
});

client.on("error", function(error) {
  console.error(error);
});