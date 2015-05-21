# node-call-rotation
A simple NodeJS-based Twilio call rotation system.

## To Use

This app is setup to deploy to a simple Heroku instance and only requires one environment variable to be set in it's config, as a comma separated list of phone number to call in rotation:

`CALLBOX_NUMBER=123-456-7890,555-555-1234,888-555-0987`


Configure Twilio to send voice calls to the following endpoint:

`http://your-app-name.herokuapp.com/rotation`
