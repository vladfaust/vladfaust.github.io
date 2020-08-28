const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPlugin(syntaxHighlight);

  const markdownIt = require("markdown-it");

  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  eleventyConfig.setLibrary("md", md);

  md.use(require("markdown-it-toc-done-right"))
  md.use(require("markdown-it-attrs"))
  md.use(require("markdown-it-imsize"))
  md.use(require("markdown-it-sub"))
  md.use(require("markdown-it-sup"))

  md.use(require("markdown-it-anchor"), {
    permalink: true,
    // permalinkSymbol: "#",
    permalinkBefore: false
  })

  md.use(require("markdown-it-implicit-figures"), {
    figcaption: true
  })

  const markdownItContainer = require("markdown-it-container");

  md.use(markdownItContainer, 'off')
  md.use(markdownItContainer, 'hero')
  md.use(markdownItContainer,
    'spoiler', {
    validate: function(params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary><div class="spoiler-content">\n';
      } else {
        return '</div></details>\n';
      }
    }
  })
};
