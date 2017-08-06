const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 80,
    env: 'PORT'
  },
  redis: {
    host: {
      doc: 'Redis host',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'CHAT_REDIS_PORT_6379_TCP_ADDR'
    },
    port: {
      doc: 'Redis port',
      format: 'port',
      default: 6379,
      env: 'CHAT_REDIS_PORT_6379_TCP_PORT'
    }
  }
});

// Perform validation
config.validate({
  allowed: 'strict'
});

module.exports = config;
