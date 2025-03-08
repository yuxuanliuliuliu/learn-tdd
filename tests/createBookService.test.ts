import mongoose from "mongoose";
import Book, { IBook } from "../models/book";
import app from "../server";
import request from "supertest";
import Author from "../models/author";
import Genre from "../models/genre";

describe("Verify POST /create_book", () => {
    // let bookSpy: jest.SpyInstance;

    // beforeAll(() => {
    //     bookSpy = jest.spyOn(Book.prototype, 'saveBookOfExistingAuthorAndGenre');
    // });
    // afterAll(() => {
    //     bookSpy.mockRestore();
    // });

    it("should create a new book for an existing author and genre", async () => {
        const mockReqBody = {
            familyName: "Tagore",
            firstName: "Robi",
            genreName: "Fiction",
            bookTitle: "Gora"
        }
        const expectedBook = {
            title: mockReqBody.bookTitle,
            summary: "A summary of Gora",
            isbn: "1234567890",
            author: new Author({}),
            genre: [new Genre({})]
        }
        Book.prototype.saveBookOfExistingAuthorAndGenre = jest.fn().mockResolvedValue(expectedBook);
        const response = await request(app)
            .post('/newbook')
            .send(mockReqBody);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
    });

    it("should return 500 if book creation fails", async () => {
        const mockReqBody = {
            familyName: "Tagore",
            firstName: "Robi",
            genreName: "Fiction",
            bookTitle: "Gora"
        }
        Book.prototype.saveBookOfExistingAuthorAndGenre = jest.fn().mockRejectedValue(new Error("Database error"));
        const response = await request(app)
            .post('/newbook')
            .send(mockReqBody);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Error creating book: Database error');
    });

    it("should return error message with status 200 for invalid inputs", async () => {
        const mockReqBody = {
            familyName: "Tagore",
            firstName: "Robi",
            genreName: "Fiction"
        }
        const response = await request(app)
            .post('/newbook')
            .send(mockReqBody);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Invalid Inputs');
    });
});