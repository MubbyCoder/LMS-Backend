const dotenv = require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbs");

const port = process.env.PORT || 5017;
console.log(port)

connectDB()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  

// change the || to your port number