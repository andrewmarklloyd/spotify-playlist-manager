import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(3000),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  SPOTIFY_CLIENT_ID: Joi.string().required()
    .description('Spotify client Id required'),
  SPOTIFY_CLIENT_SECRET: Joi.string().required()
    .description('Spotify client secret required'),
  SPOTIFY_REDIRECT_URI: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.string().default('http://localhost:4200/'),
      otherwise: Joi.string().default('http://localhost:3000')
    }),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET, 
  mongo: {
    host: envVars.MONGO_HOST,
    test: envVars.MONGO_HOST_TEST,
    port: envVars.MONGO_PORT
  },
  spotify: {
    clientId: envVars.SPOTIFY_CLIENT_ID,
    clientSecret: envVars.SPOTIFY_CLIENT_SECRET,
    redirectUri: envVars.SPOTIFY_REDIRECT_URI
  },
};

export default config;
