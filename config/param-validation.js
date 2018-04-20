import Joi from 'joi';

export default {
  login: {
    body: {
      spotifyAuthCode: Joi.string().required(),
      email: Joi.string().required()
    }
  },

  register: {
    body: {
      spotifyAuthCode: Joi.string().required(),
      email: Joi.string()
    }
  }
};
