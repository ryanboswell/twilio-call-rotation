
var helper = {

  getOrdinal: function( num ) {

    var modulus = (num % 100);

    if( [11,12,13].indexOf( modulus ) === -1 ) {
  		switch ( modulus ) {
  			// Handle 1st, 2nd, 3rd
  			case 1:
          return num+'st';
  			case 2:
          return num+'nd';
  			case 3:
          return num+'rd';
  		}
  	}
  	return num+'th';
  },


  sendResponse: function( twiml, res ) {
    if( typeof res !== 'undefined' ) {
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
  },


  endAll: {}

};

module.exports = helper;
