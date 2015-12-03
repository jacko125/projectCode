module.exports = Response;

function Response(sender, recipient, location, datetime) {
	this.sender = sender;
    this.recipient = recipient;
    this.location = location;
    this.datetime = datetime;
}


