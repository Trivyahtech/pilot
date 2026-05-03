const express = require('express');
const { fetChData } = require('./fetchData');
const { formSubmit } = require('./controller/form-submit');
const cors = require("cors");
const app = express();
const PORT = 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// API's
app.get("/data", (req, res) => {

    fetChData('1IB__sV0GWlqeglfQ3JpvPVjsu7PB7qD48dIXky_l0F4', 'pilot_impex_product_details')
        .then((data) => res.json(data));
})

app.post("/form", formSubmit)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});