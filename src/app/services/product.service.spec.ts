import { TestBed } from "@angular/core/testing";
import { ProductsService } from "./product.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { Product } from "../models/product.model";
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
      const mockData: Product[]=[
        {
          id:'123',
          title: 'title',
          price: 12,
          description: 'descripcion',
          category:{
            id:112,
            name:'name'
          },
          images:['img1','img2']
        }
      ];
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
})
