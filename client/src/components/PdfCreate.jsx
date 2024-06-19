import pdfMake from "pdfmake/build/pdfmake";
import handleClientExtRequest from "../hooks/clients/handleClientExtRequest.js";
import handleCompanyRequest from "../hooks/settings/handleCompanyRequest.js";
import docDefinition from "./pdfTemplate.jsx";
import { useEffect } from "react";

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




export default function PdfCreate ({
     products,
     taxData,
     invoice,
     error,
     loading
}){
  const [client, clientError, clientLoading] = handleClientExtRequest(invoice.clientID);
  const [company, companyError, companyLoading] = handleCompanyRequest();


    (client && company) && useEffect(()=>pdfMake.createPdf(docDefinition(products, taxData, client, company, invoice), null, pdfMakeFonts).download(client.first_name+ " " +client.last_name + " Rechnung-Nr.: " + invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "") + " " + company.name),[])
  if(clientError || companyError){
    error(clientError || companyError)
  }
  loading(clientLoading || companyLoading)
}