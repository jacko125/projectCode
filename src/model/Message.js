module.exports = Message;

function Message(params) {
    this.type = params.type;
	this.sender = params.sender;
    this.recipient = params.recipient;
    this.datetime = params.datetime;
    
    if (params.hasOwnProperty('data'))
        this.data = params.data;
}


