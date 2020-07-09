export function isPhoneRight(phone) {
	const index = phone.indexOf('-');
	if (index > -1) {
		phone = phone.replace('-', '');
	}
	const ph = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
	const mb = /^(0[0-9]{2,3})([2-9][0-9]{6,7})+([0-9]{1,4})?$/;
	if (ph.test(phone) || mb.test(phone)) {
		return true;
	} else {
		return false;
	}
}