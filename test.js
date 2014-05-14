'use strict';
var assert = require('assert');
var fs = require('fs');
var concat = require('concat-stream');
var stripBom = require('./index');

it('should strip BOM from UTF-8 string/buffer', function () {
	assert.strictEqual(stripBom(fs.readFileSync('fixture-utf8', 'utf8')), 'Unicorn\n');
	assert.strictEqual(stripBom(fs.readFileSync('fixture-utf8')).toString(), 'Unicorn\n');
});

it('should not strip anything that looks like a UTF-8-encoded BOM from UTF16LE', function () {
	var f = fs.readFileSync('fixture-utf16le');
	assert.strictEqual(stripBom(f), f);
});

it('should not strip anything that looks like a UTF-8-encoded BOM from UTF16BE', function () {
	var f = fs.readFileSync('fixture-utf16be');
	assert.strictEqual(stripBom(f), f);
});

it('should support streams', function (cb) {
	fs.createReadStream('fixture-utf8')
		.pipe(stripBom.stream())
		.pipe(concat(function (data) {
			assert.strictEqual(data.toString(), 'Unicorn\n');
			cb();
		}));
});
