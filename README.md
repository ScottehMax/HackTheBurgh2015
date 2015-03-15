![Image](http://i.imgur.com/sVPsIbF.png)

# Coolbox

##### An SMS-based Spotify jukebox, using the [Twilio](https://www.twilio.com) API and [Sails](http://sailsjs.org) 

## Installation
From the working directory, run ``npm install``, then ``sails lift``. _*It's that simple.*_

## Running
From the Twilio website, make sure the endpoint for SMS messages is pointing at your server. Apart from this, there is (next to!) no complexity in setting up and running the application. Each new song will be assigned a random id, to make it easy for people to upvote/downvote.

--------

Sent messages should take the following form:
``song artist`` or ``artist song``
Will perform a search using Spotify's API, and return the first result. Does nothing if no results were found.

``upvote (id)`` or ``downvote (id)``
Will increase or decrease the song with the specified ID.