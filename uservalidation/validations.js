const { object:_object, string } = require ("joi");

const validateUserSignup = (object) => {
  const schema = _object().keys({
    firstname: string()
      .required()
      .error(new Error("Please provide firstname")),
    lastname: string()
      .required()
      .error(new Error("Please provide lastname")),
    email: string()
      .email({ tlds: { allow: false } })
      .required()
      .error(new Error("Please provide a valid email address")),
    password: string()
      .min(8)
      .required()
      .error(
        () => new Error("Please provide a password not less than 8 characters")
      ),
  });
  return schema.validate(object);
};

module.exports ={
  validateUserSignup,
};
