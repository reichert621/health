import * as marked from 'marked';

const markdown = (content = '') => {
  const options = {
    breaks: true
  };

  return marked(content, options);
};

export default markdown;
