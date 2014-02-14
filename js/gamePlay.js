var g,
	GamePlay = {
	
		settings: {
			gameDuration: 80000,
			pointValuePair: 1000,
			pointValueSeconds: 100,
			overEightAttemptsPenalty: 50,
			currentPoints: 0,
			selected: [],
			totalPairs: 0,
			numAttempts: 0,
			numCorrect: 0,
			
			div: $('<div class="col-xs-3">'),
			row: $('<div class="row">'),

			body: $('body'),
			cardRows: $('#gameHolder .row'),
			cardContainer: $('.col-xs-3'),
			timeDisplay: $('#timeRemaining'),
			pointsDisplay: $('#userPoints'),
			userNameDisplay: $('#userName strong'),
			
			// need to dynamically set the card front container thingy
			cardFrontHolder: $('<div>'),
			
			cardFront: "../img/card-front-255x255.png",
			cardBacks: [
				{
					'id': 'a',
					'src': 'http://dummyimage.com/255x255/8A2BE2/fff&text=a'
				},{
					'id': 'b',
					'src': 'http://dummyimage.com/255x255/DC143C/fff&text=b'
				},{
					'id': 'c',
					'src': 'http://dummyimage.com/255x255/556B2F/fff&text=c'
				},{
					'id': 'd',
					'src': 'http://dummyimage.com/255x255/1E90FF/fff&text=d'
				},{
					'id': 'e',
					'src': 'http://dummyimage.com/255x255/FF8C00/fff&text=e'
				},{
					'id': 'f',
					'src': 'http://dummyimage.com/255x255/BA55D3/fff&text=f'
				},{
					'id': 'g',
					'src': 'http://dummyimage.com/255x255/000080/fff&text=g'
				},{
					'id': 'h',
					'src': 'http://dummyimage.com/255x255/FF4500/fff&text=h'
				}
			]
			
		},
		
		init: function() {
			// check if logged in
			var uid = GamePlay.getUrlParameter('uid');
			if( uid === "null" ) {
				alert('You must be logged in to play this game');
				window.location = "/";
				return false;
			}
			
			// start game timer
			g = GamePlay.settings;
			GamePlay.startTimer();
	
			// setup number of pairs for counter
			g.totalPairs = g.cardBacks.length;

			// setup some settings for the card flipping effects			
	    	/*
	    	TweenMax.set(g.body, {
	    		css: {
	    			transformStyle: "preserve-3d",
	    			perspective: 800,
	    			perspectiveOrigin: '50% 50% 0px'
	    		}
	    	});
	    	
	    	TweenMax.set(g.cardContainer, {
	    		css: {
	    			transformStyle: "preserve-3d",
	    			z: 0
	    		}
	    	});
			*/
			
			// sets up and randomizes the card backs
			var cardBacksOriginals = g.cardBacks;
				g.cardBacks = g.cardBacks.concat(g.cardBacks);	
			var cardPairs = GamePlay.shuffle(g.cardBacks);
			
			// loop through rows and card spots to create the cards
			var i = 0;
			g.cardRows.each(function(row){
				var that = this;
				$(that).children('.col-xs-3').each(function(x) {
					var cardBox = $(this);			
					cardBox.attr('data-id', g.cardBacks[i].id + row + '-' + x);
					cardBox.attr('data-back', g.cardBacks[i].src);
					cardBox.html('<a href="#" class="thumbnail unselected"><img src="'+g.cardFront+'" width="100%" /></a>');
					i++;	
				});						
			});
			
			GamePlay.bindUIActions();
			GamePlay.displayUserName();
		},
		
		bindUIActions: function() {
			g.cardContainer.on('click', function(e){
				e.preventDefault();
				
				console.log($(this).attr('data-id'));
				
				var backAttr = $(this).attr('data-back'),
					frontAttr = $(this).attr('data-front'),
					imgTag = $(this).children().children(),
					cardId = $(this).attr('data-id');
					
				// swap img sources
				if($(imgTag).attr('data-status') !== 'disabled') {
		
					//! TODO: Add flip effect
					//--------------------------------------------------------------
					
					if( $(imgTag).attr('data-status') !== 'selected' ) {
						$(imgTag).attr('src', backAttr).attr('data-status', 'selected');	
						g.selected.push(cardId);
					} else {
						$(imgTag).attr('src', frontAttr).attr('data-status', 'false');
						g.selected.pop(cardId);
					}
				}
							
				// check for correct selection
				if(g.selected.length == 2) {
					console.log(g.selected);
					
					// increment attempts
					g.numAttempts++;
					
					// check for a matching pair
					if(g.selected[0].substr(0, 1) !== g.selected[1].substr(0, 1)) {
						
						// delay the reset
						window.setTimeout(function() {
							console.log('reseting selections');
												
							//reset all cards that have not been uncovered
							$('.col-xs-3 img').each(function(idx, card) {
								//console.log(card);
								if($(card).attr('data-status') !== "disabled") {
									$(card).attr('src', g.cardFront).attr('data-status', 'false');
									//console.log(card);
								}		 
							});						
						}, 500);
											
					} else {
						console.log('matching pair');
		
						// disable matching pair from being selected again
						$('.col-xs-3[data-id="'+g.selected[0]+'"] img').attr('data-status', 'disabled');
						$('.col-xs-3[data-id="'+g.selected[1]+'"] img').attr('data-status', 'disabled');
						
						// update counter
						g.totalPairs--;
						
						GamePlay.addPointValue(g.pointValuePair, false);
						
					}
					
					
					console.log('total attempts: ' + g.numAttempts);
					// reset selection array
					g.selected = [];
					GamePlay.isGameOver();
				}
				
			});
			g.cardContainer.on('dragstart', 'img', function(event) { event.preventDefault(); });
		},
		
		startTimer: function() {
			Tock.wind(function() {
				
				var numCorrect = (g.cardBacks.length/2) - g.totalPairs;
				alert('Time\'s Up - it took you ' + g.numAttempts + ' attempts to get ' + g.numCorrect + ' pairs correct' );
				g.timeDisplay.html('0:00s');
				Tock.unwind('timeDisplayInt');
				GamePlay.saveUserResults();
				
			}, g.gameDuration, 'appTimer');
			GamePlay.timeRemaining();
			console.log('timer is running');
		},
		
		endTimer: function() {
			var result = Tock.secondsLeft('appTimer');
			Tock.unwindAll();
			return result;
		},
		
		isGameOver: function() {
			// check if game complete
			if(g.totalPairs === 0) {
				var secondsLeft = GamePlay.endTimer();
				$('#gameHolder').animate({
					opacity: 0
				}, 250, function() {
					
					// combine remaining points
					GamePlay.addPointValue( secondsLeft, true );
					GamePlay.addPointValue( -Math.abs((g.numAttempts-8)*g.overEightAttemptsPenalty), false );
					
					var rows = '<tr><td>Attempts</td><th>'+g.numAttempts+'</th></tr>';
					rows += '<tr><td># of Seconds Remaining</td><th>'+secondsLeft+'</th></tr>';
					rows += '<tr><td>Total Points</td><th>'+g.currentPoints+'</th></tr>';
										
					$('#gameHolder').html('<h2>'+g.userNameDisplay.text()+'</h2><table class="table table-bordered table-striped"><tbody>'+rows+'</tbody</table>').css({"opacity":1});
					GamePlay.saveUserResults();
				});
			}
		},
		
		shuffle: function(o) {
			for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},
		
		timeRemaining: function() {
			
			Tock.windInterval(function() {
				var timeRem = Tock.secondsLeft('appTimer');
				
				var minutes = Math.floor(timeRem / 60);
				var seconds = timeRem - minutes * 60;
				
				if(minutes === 0 && seconds === 30) {
					g.timeDisplay.removeClass('label-success').addClass('label-danger');
				}
								
				if(seconds.toString().length < 2) {
					seconds = "0" + seconds.toString();
				}
				
				g.timeDisplay.html(minutes +":"+seconds+"s");
				
				
				
			}, 1000, 'timeDisplayInt');
			
		},
		
		addPointValue: function(valueToAdd, multiplyBy) {
			
			var curPts = g.currentPoints;
			
			console.log('curPts: ' + g.currentPoints + " | Adding Value: " + valueToAdd + " | isMultiply: " + multiplyBy );
			
			if(multiplyBy) {
				curPts = curPts + (g.pointValueSeconds*(valueToAdd));
			} else {
				curPts = curPts+(valueToAdd);
			}
			
			g.currentPoints = curPts;
			g.pointsDisplay.html(g.currentPoints + "pts");
			console.log('curPts: ' + g.currentPoints);

		},
		
		displayPointValue: function(valueToAdd, multiplyBy) {
			if(pointType == 'correctPair') {
				g.currentPoints = g.currentPoints + g.pointValuePair;
				g.pointsDisplay.html(g.currentPoints + "pts");
			} else {
				g.currentPoints += pointType * g.pointValueSeconds;
				g.pointsDisplay.html(g.currentPoints + "pts");
			}

			var curPts = g.currentPoints;
			
			if(multiplyBy) {
				curPts = curPts*(valueToAdd);	
			} else {
				curPts = curPts+(valueToAdd);
			}
			
			g.currentPoints = curPts;
			g.pointsDisplay.html(g.currentPoints + "pts");
		},
		
		saveUserResults: function() {
			var uid = GamePlay.getUrlParameter('uid'),

				score = g.pointsDisplay.text().substr(0, g.pointsDisplay.text().length-3),
				
				timeRemaining = g.timeDisplay.text().substr(0, g.timeDisplay.text().length-1),
				
				timeSplit = timeRemaining.split(":"),
				msRemaining = (timeSplit[0]*60000)+(timeSplit[1]*1000),
				time = g.gameDuration - msRemaining;
				
				var ms = time % 1000;
				time = (time - ms) / 1000;
				var secs = time % 60;
				time = (time - secs) / 60;
				var mins = time % 60;
			
			if(!uid || uid === "null" || uid === "") {
				alert('Username not found, your game will not be saved.');
				return false;	
			}
				
			Database.exec("update userResults set completionTime = ?, score = ?, attempts = ? where id = ?", [mins+":"+secs, score, g.numAttempts.toString(), uid], function(result) { console.log('saved'); }, []);
			
		},
		
		getUrlParameter: function(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		    );
		},
		
		displayUserName: function() {
			var uid = GamePlay.getUrlParameter('uid');
						
			if(!uid || uid === "null" || uid === "") {
				alert('Username not found, your game will not be saved.');
				return false;	
			}
			
			Database.exec('select firstName, lastName from userResults where id = ?', [uid], function(retval, result, callbackparams) {
					g.userNameDisplay.html(retval[0].firstName + " " + retval[0].lastName).fadeIn();
				}, 
			[]);
		},
		
		showAllCards: function() {
			
			g.cardContainer.each(function(){
				var backAttr = $(this).attr('data-back'),
					frontAttr = $(this).attr('data-front'),
					imgTag = $(this).children().children(),
					cardId = $(this).attr('data-id');

				// swap img sources
				if($(imgTag).attr('data-status') !== 'disabled') {
					
					$(imgTag).attr('src', backAttr).attr('data-status', 'selected');	
					
				}

			});
			
			Tock.wind(function() {
				g.cardContainer.each(function(){
					
					var imgTag = $(this).children().children(),
						frontAttr = $(this).attr('data-front');

						console.log($(this));
					if($(imgTag).attr('data-status') !== 'disabled') {
						$(imgTag).attr('src', g.cardFront).attr('data-status', 'false');
					}
				});
			}, 500, 'showAllReset');

		}
		
};