'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const supertest = require('supertest');

describe('GET /apps', () => {
  //it should return an array of books
  it('should return an array of books', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        // expect(res.body[0]).to.include.all.keys(
        //   'bestsellers_date', 'author', 'description', 'title'
        // );
      });
  });
  
  it('should return the complete list of apps in the array by default', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(20);
      });
  });

  it('should return a 400 error if sort is true but not equal to rating or app ', () => {
    return supertest(app) 
      .get('/apps')
      .query({ sort: 'not rating'})
      .expect(400, 'Sort must be one of app or rating');
  });

  it('should sort the list by rating if value provided for sort is rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while (sorted && i < res.body.length -1){
          sorted = sorted && res.body[i].Rating <= res.body[i +1].Rating;
          i++;
        }
        //alternative test to while: compare first value to last and second value
        expect(sorted).to.be.true;
      });
  });

  it('should sort the list by app name if value provided for sort is app', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while (sorted && i < res.body.length -1){
          sorted = sorted && res.body[i].App <= res.body[i +1].App;
          i++;
        }
        //alternative test to while: compare first value to last and second value
        expect(sorted).to.be.true;
      });
  });

  it('should filter the list by given genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'Arcade' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        res.body.forEach(element => {
          expect(element.Genres).to.include('Arcade');
        });
      });
  });

  it('should return a 400 error if the genre is not part of the provided list', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'Pens' })
      .expect(400, 'Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card')
      .expect('Content-Type', /text\/html/);
  }); 
});