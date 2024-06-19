import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import docDefinition from "./pdfTemplate.jsx";


// const products =
// [
//     {
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },
//     {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },    {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },{
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },
//     {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },    {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },{
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },
//     {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },    {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },{
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },
//     {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },    {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },{
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },
//     {
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },   {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },
//     {
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },   {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },{
//     "ID":60,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,"order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":null,
//     "price_total":null,
//     "tax":7
//     },   {
//     "ID":85,
//     "invoiceID":25,
//     "clientID":5,
//     "orderID":42,
//     "productID":2,
//     "product_name":"Käsekuchenblech, 60/20",
//     "amount":3,
//     "order_date":"31.03.24",
//     "delivery_date":"01.04.24",
//     "client":"Hofladen (Hofbäckerei Klee)",
//     "price_piece":"25.00",
//     "price_total":"75.00",
//     "tax":7
//     },


//    ];


// const taxTotal = [
//     {"invoiceID":25,
//     "tax":7,
//     "total":"137.00",
//     "total_netto":"127.41",
//     "total_tax":"9.59"},
//     {"invoiceID":25,
//     "tax":12,
//     "total":"142.00",
//     "total_netto":"134.41",
//     "total_tax":"21.59"}
//     ];
// playground requires you to assign document definition to a variable called dd
const client = {
    full_name: "Klein Schmitt",
    street:  "Hauptstraße 8",
    zip: "10012",
    city: "Berlin"
}
const company = {
    name: "FeinBäckerei GbR",
    street:  "Hauptstraße 8",
    zip: "10012",
    city: "Berlin",
    phone: "+4901001001010",
    email: "test@gmail.com",
    tax_no: "123567834",
    bank: "Commerzbank",
    iban: "DE323454652354567",
    bic: "RESDEFF150",
    taxID: "DE32565212"
}
// const invoice = {
//     invoice_number: "2024002-2",
//     invoice_date: "16.06.2024",
//     delivery_date: "16.06.2024",
//     delivery_date_end: "17.06.2024"
// }

export default function PdfCreate ({
     products,
     taxData,
    // client,
    // company,
     invoice
}){

    pdfMake.createPdf(docDefinition(products, taxData, client, company, invoice)).open();

}