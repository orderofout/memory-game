var d,
	Database = {
		
		settings: {
			dbName: "memoryGame",
			dbVersion: "1.0",
			dbDesc: "Leaderboard Results",
			dbSize: 5*1024*1024,
			results: [],
			currentUserId: false
				
		},
		
		init: function() {
			
			d = Database.settings;
			
			Database.db = window.openDatabase( d.dbName, d.dbVersion, d.dbDesc, d.dbSize );
			
			if(!Database.db) {
				// Quick DB test
				console.error('DB was not created');
				return false;
			}
			
			Database.exec("CREATE TABLE IF NOT EXISTS userResults (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, completionTime INTEGER, score INTEGER, attempts INTEGER)", []);
			
		},
		
		cb: {
			//! Callbacks
			//--------------------------------------------------------------
			
			onReadyTransaction: function ( ){
				console.log( 'Transaction completed' );
			},
	
			onSuccessExecuteSql: function ( tx, results ){
				console.log( 'Execute SQL completed: ' + results.insertId);
				d.currentUserId = results.insertId;
			},

			onSuccessSql: function ( tx, results ){
				console.log( 'Update SQL completed');
			},
	
			onError: function ( err ){
				console.log( err );
			}
			
		},	
		
		exec: function(string, args, callback, callbackparams) {
		    var self = this;
		    //console.log('db execute: '+string);
		    self.db.transaction(function(tx) {
		        tx.executeSql(string, args, function(tx, result) {
		            var retval = [];
		            for (var i = 0; i < result.rows.length; ++i) {
		                retval.push(result.rows.item(i));
		            }
		            if (callback) {
		                callback(retval, result, callbackparams);
		            }
		
		        }, Database.cb.onError);
		    });
		},

		displayResults: function ( tx, results ){
	
			if(results.rows.length === 0) {
				console.error("No records found");
				return false;
			}
			
			// loop through row results
			var allRows = [];
			for(var i=0; i<results.rows.length; i++) {
				allRows.push( results.rows.item(i) );
			}
			
			// set results to an accessable variable
			d.results = allRows;

		}
		
};

(function(){
	Database.init();
})();