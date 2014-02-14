var s,
	StartScreen = {
	
		settings: {
			playBtn: $('#playBtn'),
			firstName: $('input[name="firstName"]'),
			lastName: $('input[name="lastName"]')
		},
				
		init: function() {
			s = StartScreen.settings;
			StartScreen.bindUIActions();
			console.log('Start Screen');
			
		},
		
		bindUIActions: function() {
			s.playBtn.on('click', function(e){
				e.preventDefault();
				StartScreen.createUserEntry();
			});
		},
				
		createUserEntry: function() {	
			if(s.firstName.val() === "" && s.lastName.val() === "") {
				console.error('User fields are blank');
				return false;
			} else {				
				Database.exec("INSERT INTO userResults(firstName, lastName) VALUES(?, ?)", [s.firstName.val(), s.lastName.val()], 
					function(retval, result, callbackparams) {
						console.log(result.insertId);
						$('.container h2').text('Loading game...');
						$('form').fadeOut();
						window.location = "/game.html?uid="+ result.insertId;
					},
				[]);
			}
		},

	};

(function(){
	StartScreen.init();
})();