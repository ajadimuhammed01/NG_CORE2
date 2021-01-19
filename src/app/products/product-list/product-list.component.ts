import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject, from } from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  //For the FormControl -Adding products
  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;

  //Updating the Product
  updateForm: FormGroup;
  _name: FormControl;
  _price: FormControl;
  _description: FormControl;
  _imageUrl: FormControl;
  _id: FormControl;

  //Add Modal
  @ViewChild('template', {static:true}) modal : TemplateRef<any>;

  //Update Modal
  @ViewChild('editemplate', {static:true}) editmodal : TemplateRef<any>;

  //Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;

  //Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  @ViewChild(DataTableDirective, {static:true}) dtElement: DataTableDirective;
  
  constructor(private productService : ProductService,
             private modalService: BsModalService,
             private fb: FormBuilder,
             private chRef : ChangeDetectorRef) { }
  
  onAddProduct()
  {
    this.modalRef = this.modalService.show(this.modal)
  }

  onSubmit()
  {
    let newProduct = this.insertForm.value;

    this.productService.insertProduct(newProduct).subscribe(
      result =>
      {
        this.productService.clearCache();
        this.products$ = this.productService.getProducts();

        this.products$.subscribe(newlist => {
           this.products = newlist;
           this.modalRef.hide();
           this.insertForm.reset();
           this.rerender();
        });

        console.log("New Product Added");
      },

      error => console.log("Could not add Product")
      
    )
  }
  
  //We will use this method to destroy old table and re-render new table
  rerender()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType : 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };
    this.products$ = this.productService.getProducts()

    this.products$.subscribe(result => {this.products = result;
           this.dtTrigger.next();
           this.chRef.detectChanges();
           console.log(this.products);
    });

    //Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.imageUrl = new FormControl('', [Validators.required, Validators.maxLength(50)]);

    this.insertForm = this.fb.group({
        'price': this.price,
        'name': this.name,
        'description': this.description,
        'imageUrl': this.imageUrl,
        'outOfStock': true,
    });

  }

}
