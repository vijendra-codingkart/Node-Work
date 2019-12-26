var express = require('express')
var app = express() 

 // SHOW LIST OF USERS
app.get('/view', function(req, res, next) {
	sess = req.session;

	if (!sess.user_data) {   
		req.flash('error', 'Please login required.')
		res.redirect('/login');
		res.end();
	} 
	req.getConnection(function(error, conn) {
		// console.log(sess.question_data);
		if(sess.question_data == '' ){
			var question_data = {};
			sess.question_data = question_data;
 		} 
		conn.query('SELECT * FROM questions ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('question/question_list', {
					title: 'All Questions', 
					data: ''
				})
			} else {
 				res.render('question/question_list', {
					title: 'All Questions', 
					data: rows
				})
			}
		})
	})
})

// ADD NEW question POST ACTION
app.post('/submit_qty', function(req, res, next){ 

	sess = req.session;
	if (!sess.user_data) {   
		req.flash('error', 'Please login required.')
		res.redirect('/login');
		res.end();
	}

	req.getConnection(function(error, conn) {

	    var user_correct_ans = JSON.stringify(req.body.user_correct_ans);
	    // console.log(user_correct_ans);
	    var right_ans_count = 0;
	    var attemp_quesCount = 0;
	    var answer_id  = 0;
	    if(user_correct_ans != ''){
	    	var jsonString = JSON.parse(user_correct_ans);
	    	// console.log(jsonString);
	    	var i =1;
	    	var checkResult = 0;
	    	
		    for(index in jsonString){

	 			var question_str =  jsonString[index];
	  			question_arr = question_str.split("_");
	  			var question_id = question_arr[0];

	  			if(question_arr[1] != ''){
	  				attemp_quesCount++;
	  			} 
	  			var question_ans = question_arr[1];
	  			
	 			// console.log(question_id + question_ans);
	  			
				conn.query('SELECT id FROM questions WHERE id = '+question_id+' AND answer = "'+question_ans+'" ', function(err, result, fields) {
						console.log(result.length);
						if(err) throw err

						if (result.length > 0) { 
							right_ans_count += 1;
					    }
					    if(i == jsonString.length){
				      		console.log('right_ans_count='+right_ans_count);
				      		var user_id = sess.user_data.user_id
				      		console.log(user_id);
				      	var anser_obj = {
							user_id: user_id,
							correct_ans: right_ans_count,
							total_answer: jsonString.length,
							attempt_ques: attemp_quesCount
				  		} 
							conn.query('INSERT INTO users_result SET ?', anser_obj, function(err, rows) {
			 				if (!err) {
 			 					answer_id  = rows.insertId;
 			 					console.log('inser answer'+rows.insertId);
 							    var question_data = null; 
							    sess.question_data = question_data; 
							    sess.question_time = question_data; 
							    var response = {
							    		'status':'1',
							    		'massage': 'success',
							    		'answer_id': answer_id
							    };
							    res.send(response);
							    res.end();

							}else{ 
 							    var response = {
							    		'status':'0',
							    		'massage': 'error',
							    		'answer_id': 0
							    };
							    res.send(response);
							    res.end();
							}
			 			});  
						} 
					i++;			
				})  
	      	} 
	    }else{
	    	var response = {
			    		'status':'0',
			    		'massage': 'error',
			    		'answer_id': 0
			    };
			    res.send(response);
			    res.end();

	    } 
   	})  
})

// ADD NEW question POST ACTION
app.post('/setQuestionSession', function(req, res, next){	
   // console.log(req.body);
   // console.log(JSON.stringify(req.body.correct_ans) );

    sess = req.session;
    var question_data = {
    				quesId : req.body.qid,
    				quesCount : req.body.qcount, 
    				correct_ans : req.body.correct_ans, 
    				timer_time : req.body.timer_time 
    			}
    sess.question_data = question_data;
    var response = 
    	{
    		'status':'1',
    		'massage': 'success',
    		'quesId': req.body.qid
   		};
    res.send(response);
    res.end(); 
})

app.post('/setCurrentQuestionTime', function(req, res, next){

	sess = req.session;
	var quesId = req.body.qid;
	var quesCount = req.body.qcount;
 	var timer_time = req.body.timer_time;
   	if(sess.question_time){
    	var questionSession = sess.question_time;
    	if(questionSession.quesId == quesId){
    		sess.question_time.timer_time = timer_time;
    	}else{
     		var question_time = {
				quesId : req.body.qid,
				quesCount : req.body.qcount, 
	 			timer_time : req.body.timer_time 
 			} 
 			sess.question_time = question_time;
    	}
    }else{
    	var question_time = {
			quesId : req.body.qid,
			quesCount : req.body.qcount, 
 			timer_time : req.body.timer_time 
		}
       sess.question_time = question_time;
    } 
    var response = 
    	{
    		'status':'1',
    		'massage': 'success',
    		'quesId': req.body.qid
   		};
    res.send(response);
    res.end(); 
})


// SHOW EDIT USER FORM
app.get('/question_result/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users_result WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Result not found with id = ' + req.params.id)
				res.render('question/question_result', {
					title: 'Question Result',
					data_result :  '' 
  				})
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('question/question_result', {
					title: 'Question Result',
					data_result :  rows[0] 
 				})
			}			
		})
	})
})

module.exports = app