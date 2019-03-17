const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/surveyer-test', {useNewUrlParser: true, useCreateIndex: true});
mongoose.connection
  .once('open', () => console.log('Connected'))
  .on('error', (error) => console.warn('Error:', error));

const User = require('../../models/user');

beforeEach(async () => {
  await mongoose.connection.db.createCollection('users');
});

afterEach(async () => {
  await mongoose.connection.db.dropCollection('users');
});

describe('User model', () => {

  describe('Create', () => {

    it('should create user', async () => {
      const data = {
        username: 'test',
        password: '123',
      };
      const user = new User(data);
      expect(user.isNew).to.be.true;

      await user.save();
      expect(user.isNew).to.be.false;
    });

    it('optional fields should be empty', async () => {
      const data = {
        username: 'test',
        password: '123',
      };
      const user = new User(data);
      await user.save();
      expect(user.firstName).to.be.empty;
      expect(user.lastName).to.be.empty;
      expect(user.email).to.be.empty;
    });

    it('username should become lowercase', async () => {
      const data = {
        username: 'TEST',
        password: '123',
      };
      const user = new User(data);
      await user.save();
      expect(user.username).to.equal('test');
    });

    it('invalid username should throw ValidationError exception', async () => {
      const data = {
        username: 'TEST!',
        password: '123',
      };
      try {
        const user = new User(data);
        await user.save();
      } catch (error) {
        expect(error.name).to.be.equal('ValidationError');
      }
    });
  });

  describe('setPassword', () => {

    it('should set password field');
  });
});
