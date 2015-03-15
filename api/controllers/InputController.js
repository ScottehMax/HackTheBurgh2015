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

};

var matchDown = function (text) {
	var booRegex = /-down ([0-9]+)/i;
	var matched = text.match(booRegex);

	if (matched) {
		if(matched[1].length == 4){
			return matched[1];
		} else {
			return false;
		}
	} else {
		return false;
	}

};

var matchUp = function (text) {
	var booRegex = /-up ([0-9]+)/i;
	var matched = text.match(booRegex);

	if (matched) {
		if(matched[1].length == 4){
			return matched[1];
		} else {
			return false;
		}
	} else {
		return false;
	}

};

module.exports = {
	logText: function(req,res){
		// receives HTTP POST request from twilio server
		var sender = req.body.From;
		var message = req.body.Body;
		sails.log(sender + ": " + message);

		var isDown = matchDown(message);
		var isUp = matchUp(message);

		if(isDown){
			var retObj = {'type':'down','code':isDown};

			sails.sockets.blast(retObj);
			return res.send(retObj);
		} else if(isUp){
			var retObj = {'type':'up','code':isUp};

			sails.sockets.blast(retObj);
			return res.send(retObj);
		} else {
			request('https://api.spotify.com/v1/search?type=track&q=' + message, function (err, resp, resp_body) {
				if (!err && resp.statusCode == 200) {

					// for some reason, nobody told me the response would be a string
					resp_body = JSON.parse(resp_body);

					sails.log(getStuff(resp_body));
					sails.sockets.blast({'type':'add','data':getStuff(resp_body)});
					return res.send({'type':'add','data':getStuff(resp_body)});
				}
			});
		}
	},
	sample: function(req,res){
		var searches = ['nothing more to say sophie', 'the kinks you really got me', 'lights fatherson'];
		var count = 0;

		function doReq(){
			request('https://api.spotify.com/v1/search?type=track&q=' + searches[i], function (err, resp, resp_body) {
				if (!err && resp.statusCode == 200) {

					// for some reason, nobody told me the response would be a string
					resp_body = JSON.parse(resp_body);

					sails.log(getStuff(resp_body));
					sails.sockets.blast({'type':'add','data':getStuff(resp_body)});

					count++

					doReq();
				}
			});
		}
	}
};

