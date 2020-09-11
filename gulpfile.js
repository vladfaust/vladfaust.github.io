const { watch, src, dest, parallel, series } = require("gulp")
const asciidoctor = require("@asciidoctor/gulp-asciidoctor")
const grayMatter = require("gulp-gray-matter")
const tap = require("gulp-tap")
const rename = require("gulp-rename")

function convertAdoc () {
  return src("notes/**/*.adoc")
    .pipe(grayMatter())
    .pipe(asciidoctor({
      standalone: false
    }))
    .pipe(tap(function(file) {
      file.contents = Buffer.concat([
        new Buffer("---\nasciiDoctor: true\ntemplateEngineOverride: false\n---\n"),
        file.contents
      ])
    }))
    .pipe(dest("notes"))
}

function extractFrontMatterFromAdoc () {
  return src("notes/**/*.adoc")
    .pipe(grayMatter())
    .pipe(tap(function(file) {
      file.contents = new Buffer(JSON.stringify(file.data))
    }))
    .pipe(rename(function(path) {
      path.extname = ".11tydata.json";
    }))
    .pipe(dest("notes"))
}

function processAdoc (cb) {
  parallel(
    convertAdoc,
    extractFrontMatterFromAdoc)(cb)
}

function watchAdoc () {
  watch('notes/**/*.adoc', processAdoc)
};

exports.processAdoc = processAdoc;

exports.default = parallel(
  processAdoc,
  watchAdoc)
