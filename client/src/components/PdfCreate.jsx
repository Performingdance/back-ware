import pdfMake from "pdfmake/build/pdfmake";
import handleClientExtRequest from "../hooks/clients/handleClientExtRequest.js";
import handleCompanyRequest from "../hooks/settings/handleCompanyRequest.js";
import docDefinition from "./pdfTemplate.jsx";

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
    country: "Deutschland",
    phone: "+4901001001010",
    email: "test@gmail.com",
    tax_no: "123567834",
    bank: "Commerzbank",
    iban: "DE323454652354567",
    bic: "RESDEFF150",
    taxID: "DE32565212"
}


export default function PdfCreate ({
     products,
     taxData,
     invoice,
     error,
     loading
}){
  const [client, clientError, clientLoading] = handleClientExtRequest(invoice.clientID);
  const [company, companyError, companyLoading] = handleCompanyRequest();


    (client && company) && pdfMake.createPdf(docDefinition(products, taxData, client, company, invoice), null, pdfMakeFonts).download(client.full_name + " Rechnung-Nr.: " + invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "") + " " + company.name);
  if(clientError || companyError){
    error(clientError || companyError)
  }
  loading(clientLoading || companyLoading)
}