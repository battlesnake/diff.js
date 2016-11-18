'use strict';

const _ = require('lodash');

module.exports = diff;

diff.report = report;

function diff(a, b) {
	const res = [];
	diffRecursor(a, b, '', res);
	return res;

	function diffRecursor(a, b, path) {
		if (_.every([a, b], _.isArray)) {
			const al = a.length;
			const bl = b.length;
			const ml = Math.max(al, bl);
			if (al !== bl) {
				res.push([`${path}.length`, al, bl]);
			}
			for (let i = 0; i < ml; i++) {
				const av = a[i];
				const bv = b[i];
				if (av !== bv) {
					diffRecursor(av, bv, `${path}[${i}]`);
				}
			}
		} else if (_.every([a, b], _.isPlainObject)) {
			_.union(_.keys(a), _.keys(b)).sort().forEach(key => {
				const av = a[key];
				const bv = b[key];
				if (av !== bv) {
					diffRecursor(av, bv, path ? `${path}.${key}` : key);
				}
			});
		} else {
			if (a !== b) {
				res.push([path, a, b]);
			}
		}
	}
}

function report(a, b) {
	return diff(a, b).map(
		([path, av, bv]) =>
			` * \x1b[33m${path}\x1b[0m: \x1b[36;4m${JSON.stringify(av)}\x1b[37m !== \x1b[36m${JSON.stringify(bv)}\x1b[0m`);
}

if (!module.parent) {
	const a = {
		a: 1,
		b: 2,
		c: 3,
		e: {
			f: '5potato',
			g: '6lemon',
			h: 7,
			i: [8, 9]
		}
	};
	const b = {
		b: 2,
		c: 2,
		d: 4,
		e: {
			a: 1,
			f: '5potato',
			g: '7lemon',
			i: [9, 10]
		}
	};
	const info = s => console.log(`\x1b[35m${s}\x1b[0m`);
	const dump = x => (console.log(
		JSON.stringify(x, null, 2)
			.replace(/"(\w+)":/g, (all, name) => `\x1b[4;33m${name}\x1b[0m:`)	+
		'\n'));
	info('Objects\n');
	info('A');
	dump(a);
	info('B');
	dump(b);
	info('Differences');
	console.log(report(a, b).join('\n') + '\n');
}
