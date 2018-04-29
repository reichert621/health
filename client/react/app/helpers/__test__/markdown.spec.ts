import md from '../markdown';

describe('markdown', () => {
  it('renders headers correctly', () => {
    const content = [
      '# Header 1',
      '## Header 2',
      '### Header 3',
      '#### Header 4'
    ].join('\n');

    const actual = md(content);
    const expected = [
      '<h1 id="header-1">Header 1</h1>',
      '<h2 id="header-2">Header 2</h2>',
      '<h3 id="header-3">Header 3</h3>',
      '<h4 id="header-4">Header 4</h4>\n'
    ].join('\n');

    expect(actual).toEqual(expected);
  });

  it('renders lists correctly', () => {
    const content = [
      '- item 1',
      '- item 2',
      '- item 3',
      '- item 4'
    ].join('\n');

    const actual = md(content);
    const expected = [
      '<ul>',
      '<li>item 1</li>',
      '<li>item 2</li>',
      '<li>item 3</li>',
      '<li>item 4</li>',
      '</ul>\n'
    ].join('\n');

    expect(actual).toEqual(expected);
  });

  it('renders links correctly', () => {
    const content = '[Google](www.google.com)';

    const actual = md(content);
    const expected = '<p><a href="www.google.com">Google</a></p>\n';

    expect(actual).toEqual(expected);
  });
});
