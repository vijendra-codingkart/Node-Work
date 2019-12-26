var express = require('express')
var app = express()
 

 // SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM questions ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('admin/question/view_questions', {
					title: 'All Questions', 
					data: ''
				})
			} else {
 				res.render('admin/question/view_questions', {
					title: 'All Questions', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD question FORM
app.get('/add', function(req, res, next){	
	 
	var answerJion = [];
	var optionsArray = '';
	res.render('admin/question/add_question', {
		title: 'Add New Question',
		question_name: '',
		question_type: '',
		question_time: '',
		question_hint: '',
		answer: answerJion,		
		option_a: '',		
		option_b: '',		
		option_c: '',		
		option_d: '',		
		option_e: '', 
		options: optionsArray 			
	})
	 
}) 

// ADD NEW question POST ACTION
app.post('/add', function(req, res, next){ 
	
	req.assert('question_name', 'Question Name is required').notEmpty()           //Validate name
	req.assert('question_type', 'Question Type is required').notEmpty()             //Validate age
	req.assert('question_time', 'Question Time is required').notEmpty()             //Validate age
	req.assert('option_a', 'Option A is required').notEmpty()             //Validate age
	req.assert('option_b', 'Option B is required').notEmpty()             //Validate age
	// req.assert('answer', 'Answer is required').notEmpty()             //Validate age
  
    var errors = req.validationErrors()
    
    if( !errors ) 
    {    
    	var answer = req.body.answer;
    	var jsonString = '';
    	if (req.body.hasOwnProperty('options') &&  req.body.options.length > 0){
    		var jsonString = JSON.stringify(req.body.options);
    	}
    	var answerJion = '';
    	if (req.body.hasOwnProperty('answer') && req.body.answer.length > 0){
    		var answerJion = answer.join(",");
    	}
    	

		var questions = {
			question_name: req.sanitize('question_name').escape().trim(),
			question_type: req.sanitize('question_type').escape().trim(),
			question_time: req.body.question_time,
			question_hint: req.sanitize('question_hint').escape().trim(),
			answer: answerJion,
			option_a: req.sanitize('option_a').escape().trim(),
			option_b: req.sanitize('option_b').escape().trim(),
			option_c: req.sanitize('option_c').escape().trim(),
			option_d: req.sanitize('option_d').escape().trim(),
			option_e: req.sanitize('option_e').escape().trim(),
			more_questions: jsonString
 		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO questions SET ?', questions, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					// render to views/user/add.ejs
					res.render('admin/question/add_question', {
						title: 'Add New Questions',
						question_name: questions.question_name,
						question_type: questions.question_type,
						question_time: questions.question_time,					
						question_hint: questions.question_hint,					
						answer: questions.answer,					
						option_a: questions.option_a,					
						option_b: questions.option_b,
 						option_c: questions.option_c,		
						option_d: questions.option_d,		
						option_e: questions.option_e,
						options: req.body.options					
					})
				}else{	
 					req.flash('success', 'Data added Successfully!')
 					res.redirect('/admin/questions/');
 				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('admin/question/add_question', {
			title: 'Add New Questions',
            question_name: req.body.question_name,
            question_type: req.body.question_type,
            question_time: req.body.question_time,
            question_hint: req.body.question_hint,
 			answer: req.body.answer,		
 			option_a: req.body.option_a,		
			option_b: req.body.option_b,		
			option_c: req.body.option_c,		
			option_d: req.body.option_d,		
			option_e: req.body.option_e, 
			options: req.body.options 
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM questions WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Question not found with id = ' + req.params.id)
				res.redirect('admin/questions/')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				var answerJion = [];
				if(rows[0].answer != '' ){
					 answerJion = rows[0].answer.split(",");
				} 
				var optionsArray = '';
  				if(rows[0].more_questions != '' ){
					var optionsArray = JSON.parse(rows[0].more_questions);
				} 
				
				res.render('admin/question/edit_question', {
					title: 'Edit Question', 
					id: req.params.id,
					question_name: rows[0].question_name,
					question_type: rows[0].question_type,
					question_time: rows[0].question_time,
					question_hint: rows[0].question_hint,		
					answer: answerJion,		
					option_a: rows[0].option_a,		
					option_b: rows[0].option_b,		
					option_c: rows[0].option_c,		
					option_d: rows[0].option_d,		
					option_e: rows[0].option_e,		
					options: optionsArray 		
 				})
			}			
		})
	})
})

// EDIT question POST ACTION
app.put('/edit/(:id)', function(req, res, next) {

	req.assert('question_name', 'Question Name is required').notEmpty()           //Validate name
	req.assert('question_type', 'Question Type is required').notEmpty()             //Validate age
	req.assert('question_time', 'Question Time is required').notEmpty()             //Validate age
	req.assert('option_a', 'Option A is required').notEmpty()             //Validate age
	req.assert('option_b', 'Option B is required').notEmpty()


 	//Validate age
 	var jsonOptions = '';

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!

    	var answer = req.body.answer;

    	if (req.body.hasOwnProperty('options') && req.body.options.length > 0){
    		var jsonOptions = JSON.stringify(req.body.options);
    	}
    	if (req.body.hasOwnProperty('answer') && req.body.answer.length > 0){
    		var answerJion = answer.join(",");
    	}
    	console.log(req.body.question_time); 
 		 
 		var questions = {
			question_name: req.sanitize('question_name').escape().trim(),
			question_type: req.sanitize('question_type').escape().trim(),
			question_time: req.body.question_time,
			question_hint: req.sanitize('question_hint').escape().trim(),
			answer: answerJion,
			option_a: req.sanitize('option_a').escape().trim(),
			option_b: req.sanitize('option_b').escape().trim(),
			option_c: req.sanitize('option_c').escape().trim(),
			option_d: req.sanitize('option_d').escape().trim(),
			option_e: req.sanitize('option_e').escape().trim(),
			more_questions: jsonOptions
 		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE questions SET ? WHERE id = ' + req.params.id, questions, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('admin/question/edit_question', {
						title: 'Edit Question',
						id: req.params.id,
						question_name: req.body.question_name,
			            question_type: req.body.question_type,
			            question_hint: req.body.question_hint,
			 			answer: req.body.answer,		
			 			option_a: req.body.option_a,		
						option_b: req.body.option_b,		
						option_c: req.body.option_c,		
						option_d: req.body.option_d,		
						option_e: req.body.option_e,
						options : req.body.options
					})
				} else {
					req.flash('success', 'Data updated successfully!')
 					res.redirect('/admin/questions/')
 				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		if (req.body.hasOwnProperty('options') && req.body.options.length > 0){
    		var jsonOptions = JSON.stringify(req.body.options);
    	} 
    	console.log(req.body.options);
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('admin/question/edit_question', { 
            title: 'Edit Question',            
			id: req.params.id, 
			question_name: req.body.question_name,
	        question_type: req.body.question_type,
	        question_time: req.body.question_time,
	        question_hint: req.body.question_hint,
			answer: req.body.answer,		
			option_a: req.body.option_a,		
			option_b: req.body.option_b,		
			option_c: req.body.option_c,		
			option_d: req.body.option_d,		
			option_e: req.body.option_e,
			options : req.body.options
        })
    }
})



// DELETE  question
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM questions WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/admin/questions/')
			} else {
				req.flash('success', 'Question deleted successfully!')
				// redirect to users list page
				res.redirect('/admin/questions/')
			}
		})
	})
}) 

 
module.exports = app