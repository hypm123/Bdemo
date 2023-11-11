const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parser middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// cookieParser configuration
app.use(cookieParser());

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

var fs = require("fs");
fs.readFile("./config.json", "utf8", function(err, data){
   if(err){throw err};
   var obj_config = JSON.parse(data); 
   //mongoose
   var mongoose = require('mongoose');
   mongoose.connect('mongodb+srv://'+obj_config.mongodb.username+':'+obj_config.mongodb.password+'@'+obj_config.mongodb.server+'/'+obj_config.mongodb.dbname+'?retryWrites=true&w=majority', function(err){
      if(err){throw err;}else{
        console.log("Mongodb connected successfully.");

        require("./routes/home")(app);
        require("./routes/new_wallet")(app);
        require("./routes/import_wallet")(app);
        
        
         
      }
   });
});