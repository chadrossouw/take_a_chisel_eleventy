const svgContents = require('eleventy-plugin-svg-contents');
const { DateTime } = require("luxon");
const {extractExcerpt} = require('./utilities/utilities.js');
const createIndex = require('./lunrIndex.js');
require('dotenv').config()

const inspect = require("util").inspect;

module.exports = function (eleventyConfig) {
	eleventyConfig.setBrowserSyncConfig({
		files: '../css/**/*.css',
	});
	eleventyConfig.setLiquidOptions({
		dynamicPartials: true,
	});
	eleventyConfig.addFilter("postDate", (dateString) => {
		return DateTime.fromSQL(dateString).toFormat("d MMMM yyyy");
	});
	eleventyConfig.addFilter("dateToRFC822", (dateString) => {
		return DateTime.fromSQL(dateString).toRFC2822();
	});
	eleventyConfig.addFilter("debug", (content) => `<pre>${inspect(content)}</pre>`);
	eleventyConfig.addPlugin(svgContents);
	eleventyConfig.addPassthroughCopy('src/css');
	eleventyConfig.addPassthroughCopy('src/assets');
	eleventyConfig.addPassthroughCopy('src/*.php');
	eleventyConfig.addPassthroughCopy('src/.htaccess');
	eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
	eleventyConfig.addShortcode('stringify', article => JSON.stringify(article));
	eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
		createIndex();
	  });
	return {
		dir: { input: 'src', output: '../web_tmp/' },
		passthroughFileCopy: true,
	};
};

