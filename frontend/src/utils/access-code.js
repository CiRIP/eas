export function isValidAccessCode(input) {
	const sanitized = String(input).toUpperCase();

	if (sanitized.length !== 10) return false;

	const partials = sanitized.match(/.{1,4}/g);

	if (partials[0] && !partials[0].match(/^[0-9]+$/)) return false;
	if (partials[1] && !partials[1].match(/^[A-Z]+$/)) return false;
	if (partials[2] && !partials[2].match(/^[0-9]+$/)) return false;
	
	const code = (partials[0] + partials[1] + partials[2]).replace(/[A-Z]/g, letter => letter.charCodeAt(0) - 55);
	// final check
	return mod97(code) === 1;
}

export function generateAccessCode(input) {
	let partials;
	if (input) {
		const sanitized = String(input).toUpperCase();

		if (sanitized.length !== 8) return null;

		partials = sanitized.match(/.{1,4}/g);

		if (partials[0] && !partials[0].match(/^[0-9]+$/)) return null;
		if (partials[1] && !partials[1].match(/^[A-Z]+$/)) return null;
	} else {
		partials = [random({ length: 4, charset: '0123456789' }), random({ length: 4, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' })];
	}

	const code = (partials[0] + partials[1] + '00').replace(/[A-Z]/g, letter => letter.charCodeAt(0) - 55);
	const mod = 98 - mod97(code);

	return partials[0] + partials[1] + ('0' + mod).slice(-2);
}

function mod97(string) {
	let checksum = string.slice(0, 2), fragment;
	for (let offset = 2 ; offset < string.length ; offset += 7) {
		fragment = String(checksum) + string.substring(offset, offset + 7);
		checksum = parseInt(fragment, 10) % 97;
	}
	return checksum;
}

function random(options) {
	let result = "";
	for (let i = 0 ; i < options.length ; i++) {
		result += options.charset[Math.floor(Math.random() * options.charset.length)];
	}

	return result;
}
