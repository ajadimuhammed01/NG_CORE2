import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject, from } from 'rxjs';
import {DataTableDirective} from 'angular-datatables';

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
  

  constructor() { }

  ngOnInit() {
    this.dtOptions = {
      pagingType : 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    }
  }

}
