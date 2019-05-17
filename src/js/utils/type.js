export const isFunction = unknown => typeof unknown === 'function';
export const isString = unknown => (typeof unknown === 'string' || ((!!unknown && typeof unknown === 'object') && Object.prototype.toString.call(unknown) === '[object String]'));
export const isDate = unknown => (Object.prototype.toString.call(unknown) === '[object Date]' || unknown instanceof Date) && !isNaN(unknown.valueOf());
export const isObject = unknown => ((typeof unknown === 'function' || (typeof unknown === 'object' && !!unknown)) && !Array.isArray(unknown));
export const isNode = unknown => {
	try {
		Node.prototype.cloneNode.call(unknown, false);
		return true;
	} catch (err) {
		return false;
	}
};
export const isNodeList = unknown => NodeList.prototype.isPrototypeOf(unknown);
const falsy = /^(?:f(?:alse)?|no?|0+)$/i;
export const BooleanParse = function (val) {
	return !falsy.test(val) && !!val;
};