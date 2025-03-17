import app from "../server";
import request from "supertest";
import Author from '../models/author';


describe("verify GET /authors", ()=> {

    afterEach(() => {
        jest.clearAllMocks();
      })

    it("should return a list of author names and lifetimes sorted by name", async ()=>{
        // given
        const mockAuthors: string[] = [
            'Doe, John (1900-1980)',
            'Smith, Alice (1925-2005)',
            'Taylor, Robert (1950-2020)',
          ];

        const expectedResponse = mockAuthors;
        jest.spyOn(Author, 'getAllAuthors').mockResolvedValueOnce(mockAuthors);        // when
        const response = await request(app).get(`/authors`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse)
    });

    it('should return "No authors found" when there are no authors in the database', async () => {
        jest.spyOn(Author, 'getAllAuthors').mockResolvedValueOnce([]);

    
        const response = await request(app).get('/authors');
    
        expect(response.status).toBe(200);
        expect(response.text).toBe('No authors found');
      });
    
      it('should return status 500 if there is an error fetching authors', async () => {
        (Author.getAllAuthors as jest.Mock).mockRejectedValue(new Error('Database error'));
    
        const response = await request(app).get('/authors');
    
        expect(response.status).toBe(500);
      });
})