import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, ApiResponse } from './api.service';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('GET requests', () => {
        it('should make GET request and return data', () => {
            const mockResponse: ApiResponse<any> = {
                success: true,
                data: { id: 1, name: 'Test' },
                message: 'Success'
            };

            service.get('test').subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/api/test');
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should handle GET request errors', () => {
            service.get('test').subscribe({
                next: () => fail('Should have failed'),
                error: (error) => {
                    expect(error).toBeTruthy();
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/api/test');
            req.flush('Error', { status: 500, statusText: 'Server Error' });
        });
    });

    describe('POST requests', () => {
        it('should make POST request with data', () => {
            const testData = { name: 'Test' };
            const mockResponse: ApiResponse<any> = {
                success: true,
                data: { id: 1, ...testData },
                message: 'Created'
            };

            service.post('test', testData).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/api/test');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(testData);
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            req.flush(mockResponse);
        });
    });

    describe('PUT requests', () => {
        it('should make PUT request with data', () => {
            const testData = { id: 1, name: 'Updated Test' };
            const mockResponse: ApiResponse<any> = {
                success: true,
                data: testData,
                message: 'Updated'
            };

            service.put('test', testData).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/api/test');
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(testData);
            req.flush(mockResponse);
        });
    });

    describe('DELETE requests', () => {
        it('should make DELETE request', () => {
            const mockResponse: ApiResponse<any> = {
                success: true,
                message: 'Deleted'
            };

            service.delete('test').subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/api/test');
            expect(req.request.method).toBe('DELETE');
            req.flush(mockResponse);
        });
    });
});
