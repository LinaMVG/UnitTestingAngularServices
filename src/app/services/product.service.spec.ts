import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { Product } from "../models/product.model";
import { generateManyProducts, generateOneProduct} from "../models/product.mock";
import { environment } from "./../../environments/environments";

fdescribe('Product service', ()=>{
  let productService: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        ProductsService
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  })

  it('sholud be create', ()=>{
    expect(productService).toBeTruthy();
  })

  describe('test for getAllSimple',()=>{
    it('shold be return a product list', (doneFn)=>{
      const mockData: Product[]= generateManyProducts(2);
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
      req.flush(mockData);
      httpController.verify();
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
      httpController.verify();
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
      httpController.verify();

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
      httpController.verify();
    })
  })
})
