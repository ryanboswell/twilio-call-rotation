var express            = require('express');
var twilio             = require('twilio');
var helper             = require('../libraries/helper');
var router             = express.Router();


// Parse out the rotation number list from config
var numberList = process.env.ROTATION_NUMBERS.split(',');


router.get('/', function(req, res) {
  res.status(401).end();
});


router.get('/connect', function(req, res) {
  var twiml = new twilio.TwimlResponse();

  twiml.say( 'Connecting.' );
  helper.sendResponse(twiml, res);
});


router.get('/whisper/:total?', function(req, res) {
  var twiml = new twilio.TwimlResponse();

  var total = req.param('total');
  var ordinal = '';

  // Make sure the total is at least 1
  if( typeof( total ) === 'undefined' ) {
    total = 1;
  }

  // Generate the ordinal
  ordinal = helper.getOrdinal( total );

  // Confirm with our contact they want to answer before connecting
  twiml.gather({
    numDigits: '1',
    action: '/connect',
    method: 'GET'
  }, function() {

    this.say( 'This your friendly neighborhood call rotation system.' )
        .say( 'Press any key to connect this call. You are the '+ ordinal +' contacted. If you hang up, the next person will be called.' );

  });
  twiml.hangup();

  helper.sendResponse(twiml, res);
});


router.get('/rotation/:sequence?/:total?', function(req, res) {
  var twiml = new twilio.TwimlResponse();

  var sequence = req.param('sequence');
  var total = req.param('total');
  var ordinal = '';
  var nextContact = 0;


  // If this is the first call, set sequence and total to 0
  if( typeof( sequence ) === 'undefined' ) {
    sequence = 0;
  }
  if( typeof( total ) === 'undefined' ) {
    total = 0;
  }


  // Check if we have a valid sequence number
  if( typeof( numberList[sequence] ) === 'undefined' ) {
    twiml.hangup();
    return helper.sendResponse( twiml, res );
  }


  // Only say this on the first call, then increment total
  if( total < 1 ) {
    twiml.say( 'You have reached the call rotation.' );
  }
  total++;


  // Check if we've completed the call and hangup
  if(
      ( typeof( req.query.DialCallStatus ) !== 'undefined' ) &&
      ( req.query.DialCallStatus === 'completed' )
    ) {

    twiml.hangup();
    return helper.sendResponse( twiml, res );
  }


  /*
	 * Increment the total and sequence so we can redirect to the next contact
	 * Check if we overflowed our contact list, if so reset the sequence back to 0
	 */
  nextContact = sequence;
  nextContact++;
  if( nextContact > numberList.length ) {
    nextContact = 0;
  }


  // Get the ordinal (increment by one so that the number makes sense)
  ordinal = helper.getOrdinal( total );
  twiml.say( 'Please wait while I dial the '+ ordinal +' contact.' );


  /*
	 * Create a call and provide a call complete redirect
	 * This allows us to move to the next contact if no one picks up
	 */
  twiml.dial({
    callerId: process.env.TWILIO_NUMBER,
    method: 'GET',
    action: '/rotation/'+ nextContact +'/'+ (total) +'/'
  }, function() {

    this.number({
      url: '/whisper/'+ (total) +'/',
      method: 'GET'
    }, numberList[sequence] );

  });


  // Send the response and end the request
  helper.sendResponse( twiml, res );
});


module.exports = router;
