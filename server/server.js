const express = require('express');
const cors = require('cors');
const app = express();


const corsOptions = require("./config/corsOptions.js")
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
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
const PORT = process.env.PORT || 3000;


 
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
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


app.listen(PORT, () => {
    console.log(`server is running on Port: ${PORT}`);
});