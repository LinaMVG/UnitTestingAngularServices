import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { generateManyProducts, generateOneProduct} from "../models/product.mock";
import { environment } from "./../../environments/environments";
import { HttpStatusCode, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenService } from "./token.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";

describe('Product service', ()=>{
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  })

  afterEach(()=>{
    httpController.verify();
  })

  it('sholud be create', ()=>{
    expect(productService).toBeTruthy();
  })

  describe('test for getAllSimple',()=>{
    it('shold be return a product list', (doneFn)=>{
      const mockData: Product[]= generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // [
      //   {
      //     id:'123',
      //     title: 'title',
      //     price: 12,
      //     description: 'descripcion',
      //     category:{
      //       id:112,
      //       name:'name'
      //     },
      //     images:['img1','img2']
      //   }
      // ];
      productService.getAllSimple()
      .subscribe((data)=>{
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      })

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req =httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`)
      req.flush(mockData);
    })
  })


  describe('test for getAll',()=>{
    it('shold be return a product list with getAll', (doneFn)=>{
      const mockData: Product[]= generateManyProducts(3);

      productService.getAll()
      .subscribe((data)=>{
        expect(data.length).toEqual(mockData.length);
        doneFn();
      })

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req =httpController.expectOne(url);
      req.flush(mockData);

    })

    it('should be return product list with taxes',(doneFn)=>{
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100,
        },
        {
          ...generateOneProduct(),
          price: 200,
        },
        {
          ...generateOneProduct(),
          price: 0,
        },
        {
          ...generateOneProduct(),
          price: -100,
        }
      ]
      productService.getAll()
      .subscribe((data)=>{
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products`;
      const req =httpController.expectOne(url);
      req.flush(mockData);

    })

    it('should be send query params with limit 10 and offset 3',(doneFn)=>{
      const mockData: Product[]= generateManyProducts(3);
      const limit = 10;
      const offset = 3;

      productService.getAll(limit, offset)
      .subscribe((data)=>{
        expect(data.length).toEqual(mockData.length);
        doneFn();
      })

      //http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req =httpController.expectOne(url);
      req.flush(mockData);

      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`)
      expect(params.get('offset')).toEqual(`${offset}`)
    })
  })

  describe('test for create POST',()=>{
    it('should be return a new product',(doneFn)=>{
      const mockData = generateOneProduct();
      const dto: CreateProductDTO={
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'description product',
        categoryId: 12
      }

      productService.create({...dto})
      .subscribe(data =>{
        expect(data).toEqual(mockData);
        doneFn()
      })


      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req =httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    })
  })


  describe('test for update --PUT',()=>{
    it('should update a product',(doneFn)=>{
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO ={
        title: 'new product'
      }
      const productId='1';

      productService.update(productId, {...dto})
      .subscribe(data =>{
        expect(data).toEqual(mockData);
        doneFn()
      })


      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req =httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  })

  describe('test for delete --DELETE',()=>{
    it('should delete a product',(doneFn)=>{
      const mockData = true;
      const productId='1';

      productService.delete(productId)
      .subscribe(data =>{
        expect(data).toEqual(mockData);
        doneFn()
      })


      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req =httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  })


  describe('test for getOne',()=>{

    it('should return a product',(doneFn)=>{
      const mockData :Product =generateOneProduct();
      const productId='1';

      productService.getOne(productId)
      .subscribe(data =>{
        expect(data).toEqual(mockData);
        doneFn()
      })
      

      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req =httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return a error 404',(doneFn)=>{
      const productId='1';
      const msgError = '404 message';
      const mockError ={
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }

      productService.getOne(productId)
      .subscribe({
        error: (error) =>{
          expect(error).toEqual('El producto no existe')
          doneFn()
        }
      })

      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req =httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });


  })

})
