import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject, from } from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

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
  @ViewChild('editTemplate', {static:true}) editmodal : TemplateRef<any>;

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
             private chRef : ChangeDetectorRef,
             private router: Router,
             private acct: AccountService) { }
  
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
  
  //Update existing product
  onUpdate()
  {
     let editProduct = this.updateForm.value;
     console.log(editProduct);
     this.productService.updateProduct(editProduct.id, editProduct).subscribe(
       result =>
       {
          console.log('Product Updated');
          this.productService.clearCache();
          this.products$ = this.productService.getProducts();
          this.products$.subscribe(updatedlist => 
            {
               this.products = updatedlist;
               this.modalRef.hide();
               this.rerender();
            });
       },
           error => console.log('Could Not Update Product')
     );
  }

  //Load the update Modal
  onUpdateModal(productEdit: Product): void
  {
    console.log(productEdit);
    this._id.setValue(productEdit.productId);
    this._name.setValue(productEdit.name);
    this._price.setValue(productEdit.price)
    this._description.setValue(productEdit.description);
    this._imageUrl.setValue(productEdit.imageUrl);

    this.updateForm.setValue({
       'id' : this._id.value,
       'name' : this._name.value,
       'price' : this._price.value,
       'description' : this._description.value,
       'imageUrl' : this._imageUrl.value,
       'outOfStock' : true
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onDelete(product: Product): void
  {
      this.productService.deleteProduct(product.productId).subscribe(result =>
      {
        this.productService.clearCache();
        this.products$ = this.productService.getProducts();
        this.products$.subscribe(newlist =>{
          this.products = newlist;

          this.rerender();
        })
      })
  }

  onSelect(product: Product): void
  {
    this.selectedProduct = product;
    this.router.navigateByUrl("/products/"+ product.productId);
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
    
    this.acct.currentUserRole.subscribe(result => {this.userRoleStatus = result});

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

    //Initializing Update Product Properties
    this._name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();


    this.updateForm = this.fb.group({
      'id': this._id,
      'name': this._name,
      'price': this._price,
      'description': this._description,
      'imageUrl': this._imageUrl,
      'outOfStock': true
    });
  }

  ngOnDestroy()
  {
    //Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
