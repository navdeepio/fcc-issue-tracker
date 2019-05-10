/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
const { assert, expect } = chai;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.property(res.body, '_id');
          assert.property(res.body, 'createdAt');
          assert.property(res.body, 'updatedAt');
          assert.property(res.body, 'open');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Some title',
            issue_text: 'some text',
            created_by: 'John',
          })
          .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Some title');
          assert.equal(res.body.issue_text, 'some text');
          assert.equal(res.body.created_by, 'John');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.property(res.body, '_id');
          assert.property(res.body, 'createdAt');
          assert.property(res.body, 'updatedAt');
          assert.property(res.body, 'open');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Some title',
            issue_text: 'some text',
            assigned_to: 'John'
          })
          .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Invalid input');
          done();
      });
      
    });
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'no updated fields sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: '5cd5700490e176011592058c',
            issue_text: 'new issue text',
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.message, 'successfully updated');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: '5cd5700490e176011592058c',
            issue_title: 'new issue title',
            issue_text: 'new issue text 2',
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.message, 'successfully updated');
            done();
          });
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'createdAt');
          assert.property(res.body[0], 'updatedAt');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({open: false})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, 2);
            res.body.forEach(function(element) {
              assert.isFalse(element.open);
            });
           done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ open: false, created_by: 'Max' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, 2);
            res.body.forEach(function(element) {
              assert.isFalse(element.open);
              assert.equal(element.created_by, 'Max');
            });
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send('')
          .end(function (err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.message, '_id error');
            done();
          })
      });
      
      test('Valid _id', function(done) {
        const _id = '5cd5728640dccb03e0d02a5b';
        chai.request(server)
          .delete('/api/issues/test')
          .send({ _id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.message, `deleted ${_id}`);
            done();
          });
        
      });
      
    });

    });