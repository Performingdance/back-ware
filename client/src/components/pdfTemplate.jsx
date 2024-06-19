



export default function docDefinition (products, taxData, client, company, invoice) {

    var totalNetto = 0;
    var totalBrutto = 0;
    
    var productList = [];
    var taxList = [];
    var prodRowHeights = [];
    
    products.forEach((product, key)=>{
        if ((products.length <= 22 && products.length > 14) && key == 15){
            prodRowHeights = [...prodRowHeights, 120]
        } else {
            prodRowHeights = [...prodRowHeights, 16]
        }
    
        const line = [{text: key+1}, 
        {text: product.product_name}, 
        {text: product.delivery_date}, 
        {text: product.amount}, 
        {text: product.price_piece ? parseFloat(product.price_piece).toFixed(2).toString().replace(".",",") + "€" : "0,00"  + "€",
        alignment: "right" 
        }, 
        {text: product.price_total ? parseFloat(product.price_total).toFixed(2).toString().replace(".",",") + "€" : "0,00"  + "€",
            alignment: "right" 
        }
        ];
        productList = [...productList,line];
            
    });
    
    taxData.forEach((tax, key)=>{
        totalNetto = totalNetto+parseFloat(tax.total_netto)
        totalBrutto = totalBrutto+parseFloat(tax.total)
        var taxLine =   [
                        {
                            border: [false,false,false,false],
                            text: "",
                            fillColor: "#ffffff"
                        },
    
                        {
                            colSpan: "4",
                            text: "inkl. MwSt " + parseFloat(tax.tax).toString().replace(".",",") +"%",
                            alignment: "left" 
                        },
                        "",
                        "",
                        "",
                        { text: parseFloat(tax.total_tax).toString().replace(".",",") +"€",
                        alignment: "right" 
                        }
                        ];
        taxList = [...taxList, taxLine];
    });

const dd= {
    info: {
	title: client.first_name + " " + client.last_name + " Rechnung-Nr.: " + invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "") + " " + company.name,
	author: company.name,
	creator: company.name,
	producer: company.name
  },
    pageMargins: [ 40, 100, 40, 130 ],
    header: 
    function(currentPage){
        if(currentPage == 1){
            return(
            
            {image: "logo",
            fit: [75,75],
            style: "headerR"
            }
        
        )
        }else{
        return(
            {columns: [
                {
        		 width: "auto",
        		 style: 'headerL',
        		 text: company.name +" "+ company.street_number + " "+ company.zip_code +" "+ company.city
        		        + "\n Rechnung-Nr: " + + invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "")
        		        + "\n Rechnungs-Datum: " + invoice.invoice_date,
        		 color: 'gray', fontSize:12, italics: true, 
        		 alignment: "left"
        		    
        		},
                {
                    
                },
                {image: "logo",
                fit: [50, 50],
                style: "headerR"
                }
            ]}

        
        )
            
        }
        
    },

    footer: 
    function(currentPage, pageCount, pageSize) { return (
        
        {
            columns:[
	        
    		{
    		 width: "*",
    		 style: 'footerL',
    		 text: company.name +"\n"+ company.street_number+"\n"+ company.zip_code +" "+ company.city,
    		 alignment: "left"
    		    
    		},

    		[    		{
    		 width: "*",
    		 style: 'footerC',
    		 text: "Tel.: " + company.phone +"\n Mail: "+ company.email +"\n Steuernummer: "+ company.tax_number +"\n" ,
    		 alignment: "left"
    		    
    		},
            {text: currentPage.toString() + ' von ' + pageCount,
            color: 'gray', fontSize:10, italics: true, 
            alignment: "center",
            style: "pageNo"
            }
           ],
           {width: "*",
    		 style: 'footerR',
    		 text: company.bank +"\n IBAN: "+ company.iban +"\n BIC: "+ company.bic +"\n Ust-IdNr.: "+ company.taxID,
    		 alignment: "right"
    		    
    		}
    		 
    		
		    
	    ],
        }
        ); 
        
    },
	content: [
	    {
	        
	    },
	    {text: [company.name +", " + company.street_number +", " + company.zip_code +" " + company.city ], 
	    color: 'gray', 
	    fontSize:8, 
	    italics: true
	    },
		{
		    style: 'tableAddress',
			columns: [
				[
				    {width: 100,
				    text: `${client.first_name +" "+client.last_name }
				    ${client.street_number}
				    ${client.zip_code} ${client.city}`,
			        
				    alignment: "left"},
				    {text: ' \nRechnung', style: 'subheader'}
				    
				    
				],

				{
				    width: '*',
				    text: ""
				},
				{
				    width: 150,
				    text: `
				    Rechnung-Nr.:
				    ${+ invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "")} 
				    Rechnungs-Datum:
				    ${invoice.invoice_date}
				    ${(invoice.delivery_date == invoice.delivery_date_end)?
				        "Lieferdatum: \n  " + invoice.delivery_date
				        :
				         "Lieferzeitraum:  \n  " + invoice.delivery_date + " - " + invoice.delivery_date_end   
				        
				    }`,
				    alignment: "right"
				}
			]
		
		    
		},
		{
		text: 'Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung: \n',
		style: 'text',
		alignment: "left"
		    
		},
		
		{
			style: 'tableProd',
			table: {
			    
				headerRows: 1,
				widths: [25, '*', 100,50,50, 50],
				heights: prodRowHeights,

				body: [
					[{text: 'Pos', style: 'tableHeader'}, 
					{text: 'Bezeichnung', style: 'tableHeader'},
					{text: 'Lieferdatum', style: 'tableHeader'}, 
					{text: 'Menge', style: 'tableHeader'},
					{text: 'Preis/Stück', style: 'tableHeader'},
					{text: 'Preis Gesamt', style: 'tableHeader'}],
                    ...productList,
                    [
                    {
                        border: [false,false,false,false],
                        text: "",
                        fillColor: "#ffffff"
                    },

                    {
                        colSpan: "4",
                        text: " Rechnungssumme netto"
                    },
                    "",
                    "",
                    "",
                    {text: totalNetto.toFixed(2).toString().replace(".",",")+"€",
                    alignment: "right"
                    }
                    ],
                    ...taxList,
                    [
                    {
                        border: [false,false,false,false],
                        text: "",
                        fillColor: "#ffffff"
                    },

                    {  
                        colSpan: 4,
                        border: [false,true,false,false],
                        text: " Rechnungssumme brutto"
                        
                    },
                    {text:"",
                    border: [false,true,false,false]},
                    {text:"",
                    border: [false,true,false,false]},
                    {},
                    {
                    text: totalBrutto.toFixed(2).toString().replace(".",",")+"€",
                     alignment: "right",
                     border: [false,true,false,false]
                    }
                    
                    ]
				]
			}, layout: {
				hLineWidth: function (i, node) {
				    if(i === 1 || i === node.table.body.length ){
				        return 2
				    }
				    if(i === node.table.body.length-taxList.length-1 || i === node.table.body.length-1 || i === node.table.body.length - taxList.length-2){
				        return 1
				    }else{
				        return 0
				    }


				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 0 : 0;
				},


				hLineColor: function (i, node) {
					return 'black';
				},
				hLineStyle: function (i, node) {
					if (i === 1 || i === node.table.body.length) {
						return null;
					}
					
				}
			}
		},
		{text: 'Vielen Dank für die Gute Zusammenarbeit. Bitte zahlen Sie den Betrag abzüglich eventueller Anzahlung. \n',
		style: 'textThanks',
		alignment: "left"
		},
		{ qr: "BCD\n001\n1\n\n" + company.bic + "\n" + 
		company.name + "\n" + company.iban+ "\nEUR\n" + 
		invoice.total_amount_brutto + "\n\n" +
		"Rechnung-Nr.: " + + invoice.invoice_number + (invoice.invoice_part? "-"+invoice.invoice_part : "") , 
		fit: "100"
        },
        {text: 'SEPA QR-Code  \n',
		style: 'textThanks',
		alignment: "left"
		}
		
		],
    styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 40, 0, 5]
		},
		tableProd: {
			margin: [0, 15, 0, 15]
		},
		tableAddress: {
			margin: [0, 10, 0, 15]
			
		},
		footerL: {
			margin: [40, 30, 0, 10]
			
		},
		footerC: {
			margin: [0, 30, 0, 10]
			
		},
		footerR: {
			margin: [0, 30, 40, 10]
			
		},
		headerL: {
		    margin: [40, 30, 0, 10],
			alignment: "left"
			
		},
		headerC: {
		    margin: [0, 30, 0, 10],
			alignment: "center"
			
		},
		headerR: {
		    margin: [0, 30, 20, 10],
			alignment: "right"
		},		
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		},
		textThanks:{
		    margin: [0, 10, 15, 15]
		},

	},
	images: {
	    logo: 'https://tse2.mm.bing.net/th?id=OIP.MoiE0TOseJC_Ml66xtSBCwHaHa&pid=Api',
	},
	defaultStyle: {
		// alignment: 'justify'
	}}
    return(dd)
	
}