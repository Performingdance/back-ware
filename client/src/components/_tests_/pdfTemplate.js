// playground requires you to assign document definition to a variable called dd
var client = {
    full_name: "Klein Schmitt",
    street:  "Hauptstraße 8",
    zip: "10012",
    city: "Berlin"
}
var company = {
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
var invoice = {
    invoice_number: "2024002-2",
    invoice_date: "16.06.2024",
    delivery_date: "16.06.2024",
    delivery_date_end: "17.06.2024"
}
var products = 
[
    {
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },{
    "ID":60,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,"order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":null,
    "price_total":null,
    "tax":7
    },
    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },    {
    "ID":85,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":2,
    "product_name":"Käsekuchenblech, 60/20",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"25.00",
    "price_total":"75.00",
    "tax":7
    },
    {
    "ID":113,
    "invoiceID":25,
    "clientID":5,
    "orderID":42,
    "productID":3,
    "product_name":"Käsekuchenblech, 60/40",
    "amount":3,
    "order_date":"31.03.24",
    "delivery_date":"01.04.24",
    "client":"Hofladen (Hofbäckerei Klee)",
    "price_piece":"20.00",
    "price_total":"60.00",
    "tax":7
    }
   ];
var productList = [];

products.forEach((product, key)=>{
    var line = [key+1, product.product_name, product.delivery_date, product.amount, (product.price_piece || "0,00")+ "€", (product.price_total || "0,00")+ "€"];
    productList = [...productList, line];
        
});


var dd = {
    pageMargins: [ 40, 100, 40, 130 ],
    header: 
    function(currentPage){
        if(currentPage == 1){
            return(
            
            {image: "snow",
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
        		 text: company.name +" "+ company.street+" "+ company.zip +" "+ company.city
        		        + "\n Rechnung-Nr: " + invoice.invoice_number
        		        + "\n Rechnungs-Datum: " + invoice.invoice_date,
        		 color: 'gray', fontSize:12, italics: true, 
        		 alignment: "left"
        		    
        		},
                {
                    
                },
                {image: "snow",
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
    		 text: company.name +"\n"+ company.street+"\n"+ company.zip +" "+ company.city,
    		 alignment: "left"
    		    
    		},

    		[    		{
    		 width: "*",
    		 style: 'footerC',
    		 text: "Tel.: " + company.phone +"\n Mail: "+ company.email +"\n Steuernummer: "+ company.tax_no +"\n" ,
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
	    {text: [company.name +", " + company.street +", " + company.zip +" " + company.city ], 
	    color: 'gray', 
	    fontSize:8, 
	    italics: true
	    },
		{
		    style: 'tableAddress',
			columns: [
				[
				    {width: 100,
				    text: `${client.full_name}
				    ${client.street}
				    ${client.zip} ${client.city}`,
			        
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
				    ${invoice.invoice_number} 
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
				// dontBreakRows: true,
				// keepWithHeaderRows: 1,
				widths: [25, '*', 100,50,50, 50],
				body: [
					[{text: 'Pos', style: 'tableHeader'}, 
					{text: 'Bezeichnung', style: 'tableHeader'},
					{text: 'Lieferdatum', style: 'tableHeader'}, 
					{text: 'Menge', style: 'tableHeader'},
					{text: 'Preis/Stück', style: 'tableHeader'},
					{text: 'Preis Gesamt', style: 'tableHeader'}],
                    ...productList
					/*[
					   "1", "Käsekuchen, rund 26", "16.06.2024","2", "25,00"+ "€", "50,00"+ "€"					 
					],
                    [
                        "2", "Käsekuchen, rund 26", "16.06.2024","2", "25,00"+ "€", "50,00"+ "€"					 
                    ]
                    */
				]
			},
			layout: {
			    fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
			}
		},
		{text: 'Vielen Dank für die Gute Zusammenarbeit. Bitte zahlen Sie den Betrag abzüglich eventueller Anzahlung. \n',
		style: 'textThanks',
		alignment: "left"
		},
		{ qr: `BCD
		001
		1
		SCT
		RESDEFF150
		FeinBaeckerei 17111
		DE68150400680858672912
		EUR10
		CHAR
		
		Rechnung-Nr.: 2024001-1`
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
			margin: [0, 10, 0, 5]
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
	    snow: 'https://tse2.mm.bing.net/th?id=OIP.MoiE0TOseJC_Ml66xtSBCwHaHa&pid=Api',
	},
	defaultStyle: {
		// alignment: 'justify'
	}
	
}