/*

//! TODO:
//--------------------------------------------------------------

	- select user object based on id in url
	- accumulate points for each corrrect pair
	- accumulate points for each second remaining if game is completed under time
	- display Congratulations/Game Over screen
		- with user name
		- total points
		- attempts
		- completion time
	- log performance to database
	
	- clean up game.js
	- convert to moduluar setup with config file

*/





var selected = [],
	totalPairs = 0,
	numAttempts = 0,
	numCorrect = 0,
	cardRows = $('#gameHolder .row'),
	cardFront = "../img/card-front-255x255.png",
	cardBacks = [
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



$(document).ready(function() {
	
	startTimer();
	
	// setup number of pairs for counter
	totalPairs = cardBacks.length;
	
	// sets up and randomizes the card backs
	var cardBacksOriginals = cardBacks;
		cardBacks = cardBacks.concat(cardBacks);	
	var cardPairs = Shuffle(cardBacks);
	
	// loop through rows and card spots to create the cards
	var i = 0;
	cardRows.each(function(row){
		var that = this;
		$(that).children('.col-xs-3').each(function(x) {
			var cardBox = $(this);			
			cardBox.attr('data-id', cardBacks[i].id + row + '-' + x);
			cardBox.attr('data-back', cardBacks[i].src);
			cardBox.html('<a href="#" class="thumbnail unselected"><img src="'+cardFront+'" /></a>');
			i++;	
		});						
	});
	
	// event action
	$('.col-xs-3').on('click', function(e){
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
				selected.push(cardId);
			} else {
				$(imgTag).attr('src', frontAttr).attr('data-status', 'false');
				selected.pop(cardId);
			}
		}
					
		// check for correct selection
		if(selected.length == 2) {
			console.log(selected);
			
			// increment attempts
			numAttempts++;
			
			// check for a matching pair
			if(selected[0].substr(0, 1) !== selected[1].substr(0, 1)) {
				
				// delay the reset
				window.setTimeout(function() {
					console.log('reseting selections');
										
					//reset all cards that have not been uncovered
					$('.col-xs-3 img').each(function(idx, card) {
						//console.log(card);
						if($(card).attr('data-status') !== "disabled") {
							$(card).attr('src', cardFront).attr('data-status', 'false');
							//console.log(card);
						}		 
					});						
				}, 500);
									
			} else {
				console.log('matching pair');

				// disable matching pair from being selected again
				$('.col-xs-3[data-id="'+selected[0]+'"] img').attr('data-status', 'disabled');
				$('.col-xs-3[data-id="'+selected[1]+'"] img').attr('data-status', 'disabled');
				
				// update counter
				totalPairs--;
			}
			
			
			console.log('total attempts: ' + numAttempts);
			// reset selection array
			selected = [];
			isGameOver();
		}
		
	});
	$('.col-xs-3').on('dragstart', 'img', function(event) { event.preventDefault(); });
});



function startTimer() {
	Tock.wind(function() {
		
		var numCorrect = (cardBacks.length/2) - totalPairs;
		alert('Time\'s Up - it took you ' + numAttempts + ' attempts to get ' + numCorrect + ' pairs correct' );
		
	}, 60000, 'appTimer');
	console.log('timer is running');
}

function endTimer() {
	var result = Tock.secondsLeft('appTimer');
	Tock.unwind('appTimer');
	return result;
}

function isGameOver() {
	// check if game complete
	if(totalPairs == 0) {
		var secondsLeft = endTimer();
		$('#gameHolder').animate({
			opacity: 0
		}, 250, function() {
			$('#gameHolder').html('<p class="lead">game over - it took you ' + numAttempts + ' attempts with ' + secondsLeft + ' seconds remaining</p>' ).css({"opacity":1});
		});
	}
}

function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};