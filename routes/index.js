var express = require('express')
var app = express()
  

app.get('/', function(req, res) {
	sess = req.session;
	// render to views/index.ejs template file
	res.render('index', {title: 'My Node.js Application'})
})

// SHOW Login OF USERS
app.get('/login', function(req, res, next) {
	sess = req.session;
 	if (sess.user_data) {   
		req.flash('success', 'You are already logged in.')
		res.redirect('/');
		res.end();
	}else{
 		res.render('login', {title: 'login Form'})
	} 
})

// ADD NEW USER POST ACTION
app.post('/login', function(req, res, next){
    sess = req.session;	
    sess = null; 
    sess = req.session;
	req.assert('email', 'Email is required').notEmpty()           //Validate name
	req.assert('password', 'Password is required').notEmpty()
	// req.assert('user_role', 'User role is required').notEmpty()

	var errors = req.validationErrors()
    
    if( !errors ) 
    {    
		var user = [ req.sanitize('email').escape().trim(), req.sanitize('password').escape().trim()]

 		req.getConnection(function(error, conn) {
			conn.query('SELECT * FROM users WHERE email = ? AND password = ?', user, function(err, rows, fields) {
				if(err) throw err
				
				// if user not found
				if (rows.length <= 0) {

					if(req.body.user_role == 'admin' ){
						req.flash('error', 'Admin Login Failed.')
					    res.redirect('/admin')
				    }else{ 
			 	    	req.flash('error', 'User Login Failed.')
						res.render('login', { 
				            title: 'Login',
				            email: req.body.email,
				            password: req.body.password 
				        })
				    }	 
				}
				else { // if user found
					// render to views/user/edit.ejs template file
					req.flash('success', 'successfully User Login!')
					//res.redirect('/question')
				    sess = req.session;
				    
				    var user_data = {
				    				user_id : rows[0].id,
				    				name : rows[0].name,
				    				email : rows[0].email,
				    				user_role : rows[0].user_role
				    			}
				    sess.user_data = user_data;
				     
				    if(rows[0].user_role == 'admin' ){
				    	res.redirect('/admin/dashboard')
				    }else{ 
				    	res.redirect('/')
				    }
					
				}			
			})
		})

	} else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)

		if(req.body.user_role == 'admin' ){
		    res.redirect('/admin')
	    }else{ 
 	    	res.render('login', { 
	            title: 'Login',
	            email: req.body.email,
	            password: req.body.password 
	        }) 
	    } 
    }

});

// SHOW Login OF USERS
app.get('/singup', function(req, res, next) {
	sess = req.session;
	if (sess.user_data) {   
		req.flash('success', 'You are already logged in.')
		res.redirect('/');
 	}else{
 		res.render('singup', {title: 'Singup Form'})
	} 
})


app.post('/email_exists', function(req, res, next){

	var email =  req.body.email;

     req.getConnection(function(error, conn) {
		conn.query('SELECT id FROM users WHERE email = ?', [email], function(err, rows, fields) {
			if(err) throw err 

			// if user not found
			if (rows.length <= 0) {
 				var response = 
		    	{
		    		'status':'0',
		    		'massage': 'success',
		    		'massage': ''
		   		};
			    res.send(response);
			    res.end();
 			}
			else { // if user found
				var response = 
		    	{
		    		'status':'1',
		    		'massage': 'error',
		    		'massage': 'email already exists'
		   		};
			    res.send(response);
			    res.end(); 	 
			}			
		})
	}) 
})
// ADD NEW USER POST ACTION
app.post('/singup', function(req, res, next){	
	sess = req.session;
	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'Email is required').notEmpty()           //Validate name
	req.assert('password', 'Password is required').notEmpty()
	req.assert('user_role', 'User role is required').notEmpty()

	var errors = req.validationErrors()
    
    if( !errors ) 
    {    
		var users = {
			name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			password: req.sanitize('password').escape().trim(), 
			user_role: req.sanitize('user_role').escape().trim() 
  		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', users, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					// render to views/user/add.ejs
					res.render('singup', {
						title: 'Singup',
						name: users.name,
						email: users.email,
						password: users.password
 					})
				}else{	
 					req.flash('success', 'User added Successfully!')
 					res.redirect('/login')
 				}
			})
		})
	} else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
	 
        res.render('singup', { 
            title: 'Singup',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password 
        })
    }

});

// SHOW Login OF USERS
app.get('/logout', function(req, res, next) {
	sess = req.session;
	var user_role = '';
    if ( sess.user_data ) {
    	user_role = sess.user_data.user_role; 
    } 

	req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        if(user_role == 'admin'){
        	res.redirect('/admin');
        }else{
        	res.redirect('/login');
        }
    });
})


/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
