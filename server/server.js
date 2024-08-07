const express = require('express');
const cors = require('cors');
const app = express();


const corsOptions = require("./config/corsOptions.js")
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const settingsRoute = require("./routes/settings.js");
const recipeRoute = require("./routes/recipes.js");
const ingRoute = require("./routes/ingredients.js");
const formRoute = require("./routes/form.js");
const machinesRoute = require("./routes/machines.js");
const daylistRoute = require("./routes/daylist.js");
const clientsRoute = require("./routes/clients.js");
const ordersRoute = require("./routes/orders.js");
const invoicesRoute = require("./routes/invoices.js");
const margesRoute = require("./routes/marges.js");
const worksheetRoute = require("./routes/worksheet.js");
const titlesRoute = require("./routes/titles.js");
const calcRoute = require("./routes/calculator.js");
const baseRoute = require("./routes/base.js");
const imgsRoute = require("./routes/images.js");
const productsRoute = require("./routes/products.js");
const pushNotesRoute = require("./routes/pushNotes.js");

const PORT = process.env.PORT || 3000;

// app.get("/*", function (req,res){
//     res.sendFile(
//         path.join(__dirname, "../client/build/index.html"),
//         function (err){
//             if(err){
//                 res.status(500).send(err)
//             }
//         }
//     );
// });

 
app.use(express.json());
app.use("/public",express.static("/var/lib/data"))
app.use(cors(corsOptions));

app.use('/', baseRoute);
app.use('/api/auth', authRoute);
app.use('/api/s/users', userRoute);
app.use('/api/s/settings', settingsRoute);
app.use('/api/s/recipes', recipeRoute);
app.use('/api/s/ing', ingRoute);
app.use('/api/s/form', formRoute);
app.use('/api/s/machines', machinesRoute);
app.use('/api/s/daylist', daylistRoute);
app.use('/api/s/clients', clientsRoute);
app.use('/api/s/orders', ordersRoute);
app.use('/api/s/invoices', invoicesRoute);
app.use('/api/s/marges', margesRoute);
app.use('/api/s/worksheet', worksheetRoute);
app.use('/api/s/titles', titlesRoute);
app.use('/api/s/calc', calcRoute);
app.use('/api/s/imgs', imgsRoute);
app.use('/api/s/products', productsRoute);
app.use('/api/s/push', pushNotesRoute);


app.listen(PORT, () => {
    console.log(`server is running on Port: ${PORT}`);
});