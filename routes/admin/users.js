var express = require('express')
// var app = express.Router(); 
var router = express.Router() 

 // SHOW LIST OF USERS
router.get('/', function(req, res) {

	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('admin/users/users', {
					title: 'All Users', 
					data: ''
				})
			} else {
 				res.render('admin/users/users', {
					title: 'All Users', 
					data: rows
				})
			}
		})
	})
})

module.exports = router