const joi  = require ("joi");

const validateUserSignup = (object) => {
  const schema = joi.object().keys({
    firstname: joi.string()
      .required()
      .error(new Error("Please provide firstname")),
    lastname: joi.string()
      .required()
      .error(new Error("Please provide lastname")),
    email: joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .error(new Error("Please provide a valid email address")),
    password: joi.string()
      .min(6)
      .required()
      .error(
        () => new Error("Please provide a password not less than 6 characters")
      ),
      role: joi.string().valid("user", "admin").optional(),
  });
  return schema.validate(object);
};
const validateUserLogin = (object) => {
  const schema = joi.object().keys({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .error(new Error("Please provide a valid email address")),
    password: joi
      .string()
      .min(6)
      .required()
      .error(() => new Error("Please provide a password not less than 6 characters")),
  });
  return schema.validate(object);
};

module.exports ={
  validateUserSignup,
  validateUserLogin
};
