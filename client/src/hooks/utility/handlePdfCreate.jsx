import pdfMake from "pdfmake/build/pdfmake";
import docDefinition from "./PdfTemplate.js";
import { useEffect, useState } from "react";

const pdfMakeFonts = {
    Roboto: {
      normal:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
      bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      italics:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
      bolditalics:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
  };
  pdfMake.fonts = pdfMakeFonts




export default function handlePdfCreate (

){

    const [loading, setLoading] = useState(false);

    function handleRequest(  
      products,
      taxData,
      invoice,
      client,
      company){
      console.log(products,taxData,
        invoice,
        client,
        company)
     setLoading(true)
      pdfMake.createPdf(docDefinition(products, taxData, client, company, invoice), null, pdfMakeFonts).download(client.first_name + " " + client.last_name + " Rechnung-Nr " + (invoice.invoice_part?  invoice.invoice_number +  "-"+invoice.invoice_part : invoice.invoice_number ) + " " + company.name)
     setLoading(false)
    }





return [loading, handleRequest];

}
