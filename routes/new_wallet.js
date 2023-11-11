module.exports = function(app){
    // Route to handle the form submission
    app.get('/new-wallet', (req, res) => {
        if (req.session.user) {
            // The user is logged in, render the home page
            res.render('home');
        } else {
            // The user is not logged in, redirect to the add-wallet page
            res.render('new_wallet');
        }
    });
    app.post('/new-wallet', (req, res) => {
        const name = req.body.name;
        const password = req.body.password;
        const reenterPassword = req.body['reenter-password'];
    
        // Handle your logic here
        // For example, validate the password, check if the passwords match, etc.
    
        if (password !== reenterPassword) {
        // Passwords don't match, handle the error
        res.send('Passwords do not match.');
        } else {
        // Proceed with wallet creation logic
        // ...
    
        res.send('Wallet created successfully!');
        }
    });
}
