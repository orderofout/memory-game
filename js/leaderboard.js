var lb,
	Leaderboard = {
		
		settings: {
			topNumUsers: 10,
			roster: [],
			leaderboardHolder: $('.col-xs-12 table tbody')
		},
		
		init: function() {
			console.log('Leaderboard Created');
			lb = Leaderboard.settings;
			
			Leaderboard.getTopUsers();
			
		},
		
		bindUIAction: function() {
			
		},
		
		getTopUsers: function() {
			Database.exec("select * from userResults order by score desc limit "+lb.topNumUsers, [], function(result){
				console.log(result);
				lb.roster = result;
				Leaderboard.createTable();
			}, []);
		},
		
		createTable: function() {
		
			for(var x=0;x<lb.roster.length;x++){
				
				var html = "<tr>";
		  			html += "<td>"+(x+1)+"</td>";
			  		html += "<td>"+lb.roster[x].firstName+ " "+ lb.roster[x].lastName+"</td>";
			  		html += "<td>"+lb.roster[x].score+"pts</td>";
			  		html += "<td>"+lb.roster[x].completionTime+"s</td>";
			  		html += "<td>"+lb.roster[x].attempts+"</td>";
			  		html += "</tr>";				
				
				lb.leaderboardHolder.append(html);	
			}
		
			

			
		}
		
		
		
};

(function() {
	Leaderboard.init();
})();