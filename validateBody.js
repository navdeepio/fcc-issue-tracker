const Joi = require('@hapi/joi');

module.exports = {
  newIssueSchema: Joi.object().keys({
    issue_title: Joi.string().required(),
    issue_text: Joi.string().required(),
    created_by: Joi.string().required(),
    assigned_to: Joi.string(),
    status_text: Joi.string(),
  }),
};
