import marked from 'marked';
import highlight from 'highlight.js';

const markdown = (content = '') => {
  const options = {
    highlight(code, lang) {
      if (highlight.getLanguage(lang)) {
        return highlight.highlight(lang, code).value;
      } else {
        return highlight.highlightAuto(code).value;
      }
    }
  };

  return marked(content, options);
};

export default markdown;
