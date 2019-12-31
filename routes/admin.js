var express = require('express')
var app = express()
var url = require('url');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const questions = require('./admin/questions')
const users = require('./admin/users')


app.use((req, res, next) => {
	sess = req.session;
    if ( sess.user_data ) {
    	if (sess.user_data.user_role == 'user') {
    		req.flash('error', 'You do not have permissions to access this page')  
 			res.redirect('/');
			res.end(); 
 		}        
    }else{
     	if( (req.originalUrl != '/admin') && (req.originalUrl != '/admin/')){
 	    	req.flash('error', 'You are now signed out')  
			res.redirect('/admin');
			res.end(); 
		}
    }
    next(); 
});

app.get('/', function(req, res) {
  	sess = req.session;
 	if (sess.user_data) {
 	    req.flash('success', 'You are already logged in.')  
 		if (sess.user_data.user_role == 'admin') {
 			res.redirect('/admin/dashboard');
			res.end(); 
 		}else{
 			res.redirect('/');
			res.end(); 
 		}   
 	}else{
		res.render('admin/login', {title: 'Admin Login'})
	} 
}) 
app.get('/dashboard', function(req, res) {
	// render to views/index.ejs template file
	res.render('admin/index', {title: 'Dashboard'})
}) 

app.use('/questions', questions)
app.use('/users', users)

module.exports = app;