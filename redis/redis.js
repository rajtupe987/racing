

const redis = require('redis');
const client = redis.createClient({
	url: "redis://default:tNosTjJrZkhhFcylop17WUzicwZTudXP@redis-12511.c16.us-east-1-2.ec2.cloud.redislabs.com:12511"
});

client.on('error', (err) => console.log(err.message));
(async () => await client.connect())()
client.on('ready', () => console.log('Redis client connected'));

module.exports = { client }

