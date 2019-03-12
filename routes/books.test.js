process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let books;


beforeEach(async () => {
    await db.query(`DELETE FROM books`);
    
    let userResult = await db.query(
        `INSERT INTO
        books(isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES('123456789', 'www.amazon.com/12345', 'Test', 'English', 41, 'test', 'Test Book', 1999)
        RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`);

    books = userResult.rows[0];
});

afterAll( async () => {
    await db.end();
});




describe("GET/books", function() {
    test("Gets a user with its information", async function(){
        const resp = await request(app).get(`/books`);
        expect (resp.statusCode).toBe(200);
        expect (resp.body.books.length).toBe(1);
        expect (resp.body.books[0].isbn).toEqual('123456789');
    });

    // test("Get a user that does not exist", async function(){
    //     const resp = await request(app).get('/users/John');
    //     expect (resp.statusCode).toBe(404);
    // });
});