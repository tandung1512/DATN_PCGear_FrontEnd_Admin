import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-invoice-detailed',
  templateUrl: './invoice-detailed.component.html',
  
})
export class InvoiceDetailedComponent implements OnInit {
    invoiceID!: number;
    userName!: string;
    orderDate!: string;
    items: any[] = [];
    prop: string = '';
    currentPage: number = 1;
    pageCount: number = 1;
    itemsPerPage: number = 5;
    begin: number = 0;
    host: string = environment.host;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadInvoiceDetails(id);
  }

  loadInvoiceDetails(id: number) {
    const url = `${this.host}/ordered-list/details/${id}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.items = data;

        if (this.items.length > 0) {
          const detailedInvoice = this.items[0];
          this.invoiceID = detailedInvoice.invoice.id;
          this.userName = detailedInvoice.invoice.user.name;
          this.orderDate = detailedInvoice.invoice.orderDate;
        }

        this.pageCount = Math.ceil(this.items.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching invoice details:', error);
      }
    );
  }

  sortBy(prop: string) {
    this.prop = prop;
  }

  first() {
    this.begin = 0;
    this.currentPage = 1;
  }

  prev() {
    if (this.begin > 0) {
      this.begin -= this.itemsPerPage;
      this.currentPage--;
    }
  }

  next() {
    if (this.begin < (this.pageCount - 1) * this.itemsPerPage) {
      this.begin += this.itemsPerPage;
      this.currentPage++;
    }
  }

  last() {
    this.begin = (this.pageCount - 1) * this.itemsPerPage;
    this.currentPage = this.pageCount;
  }
}
