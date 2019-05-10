/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { isEmpty } = require('lodash');
const { newIssueSchema } = require('../validateBody');
const Issue = require('../Issue');

const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true });

module.exports = (app) => {
  app.route('/api/issues/:project')
    .get((req, res) => {
      const { project } = req.params;
      if (!project) {
        res.status(400).json({ message: 'No project specified' });
      }
      if (isEmpty(req.query)) {
        // find all issues related to a project
        Issue.find({ project }, (err, result) => {
          if (err) {
            res.status(400).json({ message: 'project not found' });
          }
          res.json(result);
        });
      } else {
        const queryParams = { project, ...req.query };
        Issue.find(queryParams, (err, result) => {
          if (err) {
            res.status(400).json({ message: 'Bad request' });
          }
          res.json(result);
        });
      }
    })
    .post((req, res) => {
      const { project } = req.params;
      if (!project) {
        res.status(400).json({ message: 'No project specified' });
      }
      const result = Joi.validate(req.body, newIssueSchema);
      if (!result.error) {
        // valid input
        let {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        } = req.body;
        assigned_to = assigned_to || '';
        status_text = status_text || '';
        const issue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        });
        issue.save((err, data) => {
          if (err) throw err;
          res.json(data);
        });
      } else {
        // invalid input
        res.status(400).json({ message: 'Invalid input' });
      }
    })
    .put((req, res) => {
      const { project } = req.params;
      if (!project) {
        res.status(400).json({ message: 'No project specified' });
      }
      const { _id } = req.body;
      if (!_id) {
        res.status(400).json({ message: 'no updated fields sent' });
      }
      const toBeChecked = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'];
      const updates = toBeChecked.reduce((prev, curr) => {
        if (req.body[curr]) {
          prev[curr] = req.body[curr];
        }
        return prev;
      }, {});
      if (Object.keys(updates).length === 0) {
        res.status(400).json({ message: 'no updated fields sent' });
      }
      Issue.findByIdAndUpdate(_id, { new: true }, updates, (err, data) => {
        if (err) {
          res.status(500).json({ message: `could not update ${_id}` });
        }
        res.json({ message: 'successfully updated', data });
      });
    })
    .delete((req, res) => {
      const { _id } = req.body;
    console.log('the id is ', _id);
      if (!_id) {
        return res.status(400).json({ message: '_id error' });
      }
      Issue.findByIdAndDelete(_id, (err, data) => {
        if (err) {
          res.status(500).json({ message: `could not delete ${_id}` });
        } else {
          res.json({ message: `deleted ${_id}` });
        }
      });
    });
};
