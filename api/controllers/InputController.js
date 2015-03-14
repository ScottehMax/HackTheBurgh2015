/**
 * InputController
 *
 * @description :: Server-side logic for managing inputs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

var getStuff = function (d) {
	if (d) {
		var track = d.tracks.items[0];
		var ret = {
		    'id':          track.id,
		    'songName':    track.name,
		    'artistName':  track.artists[0].name,
		    'streamUrl':   track.preview_url,
		    'coverUrl':    track.album.images[0].url
		};
		return ret;

	} else {
		return false;
	}

}

module.exports = {
	logText: function(req,res){
		// receives HTTP POST request from twilio server
		var sender = req.body.From;
		var message = req.body.Body;
		sails.log(sender + ": " + message);

		request('https://api.spotify.com/v1/search?type=track&q=' + message, function (err, res, resp_body) {
			if (!err && res.statusCode == 200) {

				// for some reason, nobody told me the response would be a string
				resp_body = JSON.parse(resp_body);

				// NOTE: just logs for now
				sails.log(getStuff(resp_body));
			}
		})
		return true;
	}
};

