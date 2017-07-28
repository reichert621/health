import * as marked from 'marked';
import * as highlight from 'highlight.js';

const markdown = (content = '') => {
  const options = {
    breaks: true,
    highlight(code: string, lang: string) {
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
