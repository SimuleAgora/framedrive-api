
const {ObjectID} = require('mongodb');
var mountStringEncoded = (str) => {
 	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
	var to   = "aaaaaeeeeeiiiiooooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++) {
	    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '')
	    .replace(/\s+/g, '-') 
	    .replace(/-+/g, '-'); 
 	return str;             
}

var validateId= (id) => {
	if (!ObjectID.isValid(id)) {
		return true;
	}
}
module.exports = {mountStringEncoded, validateId};