import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import '../App.less';

class Library extends React.Component {
  constructor(props) {
    super(props);

    // TODO: handle radio/checkbox inputs in separate components
    this.state = {
      selected: null,
      checked: { one: false, two: false, three: false }
    };
  }

  handleRadioUpdate(e) {
    const option = e.target.value;

    return this.setState({ selected: option });
  }

  handleCheckboxToggle(val) {
    const { checked }  = this.state;
    const update = {
      ...checked,
      [val]: !checked[val]
    };

    return this.setState({ checked: update });
  }

  render() {
    const { selected, checked } = this.state;

    return (
      <div className="default-container">
        <h1>
          Component Library
        </h1>

        <div className="component-container">
          <h2>Headers</h2>
          <h1>h1</h1>
          <h2>h2</h2>
          <h3>h3</h3>
          <h4>h4</h4>
        </div>

        <div className="component-container">
          <h2>Buttons &amp; Links</h2>

          <button className="button-default">
            button-default
          </button>

          <button className="button-default -large">
            button-default -large
          </button>

          <Link to="/">Link</Link>
        </div>

        <div className="component-container">
          <h2>Forms &amp; Inputs</h2>

          <div>
            <label className="label-default">
              label-default
            </label>
            <input
              type="text"
              className="input-default"
              placeholder="input-default" />
          </div>

          <div>
            <input
              type="text"
              className="input-default -inline"
              placeholder="input-default -inline" />

            <input
              type="text"
              className="input-default -inline"
              placeholder="input-default -inline" />

            <input
              type="text"
              className="input-default -inline"
              placeholder="input-default -inline" />
          </div>

          <div>
            <input
              type="text"
              className="input-default -wide"
              placeholder="input-default -wide" />
          </div>

          <div>
            <label className="label-default -large">
              label-default -large
            </label>
            <input
              type="text"
              className="input-default -large"
              placeholder="input-default -large" />
          </div>

          <div>
            <textarea
              rows="10"
              className="input-default -wide -large"
              placeholder="textarea input-default -wide -large">
            </textarea>
          </div>

          <div>
            <label>
              <input
                type="radio"
                value="optionOne"
                checked={selected === 'optionOne'}
                onChange={this.handleRadioUpdate.bind(this)} />
              Option #1
            </label>

            <label>
              <input
                type="radio"
                value="optionTwo"
                checked={selected === 'optionTwo'}
                onChange={this.handleRadioUpdate.bind(this)} />
              Option #2
            </label>

            <label>
              <input
                type="radio"
                value="optionThree"
                checked={selected === 'optionThree'}
                onChange={this.handleRadioUpdate.bind(this)} />
              Option #3
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                value="one"
                checked={checked.one}
                onChange={this.handleCheckboxToggle.bind(this, 'one')} />
              Option #1
            </label>

            <label>
              <input
                type="checkbox"
                value="two"
                checked={checked.two}
                onChange={this.handleCheckboxToggle.bind(this, 'two')} />
              Option #2
            </label>

            <label>
              <input
                type="checkbox"
                value="three"
                checked={checked.three}
                onChange={this.handleCheckboxToggle.bind(this, 'three')} />
              Option #3
            </label>
          </div>
        </div>

        <div className="component-container">
          <h2>Colors &amp; Typography</h2>

          <h3 style={{ color: '#d0d0d0' }}>
            @border-gray: #d0d0d0;
          </h3>
          <h3 style={{ color: '#eee' }}>
            @light-gray: #eee;
          </h3>
          <h3 style={{ color: '#2b2b2b' }}>
            @black: #2b2b2b;
          </h3>
          <h3 style={{ color: '#3e886b' }}>
            @dark-green: #3e886b
          </h3>
          <h3 style={{ color: '#3db787' }}>
            @bright-green: #3db787;
          </h3>
          <h3 style={{ color: '#da2a54' }}>
            @red: #da2a54;
          </h3>
          <h3 style={{
            background: '#d0d0d0',
            color: '#fff',
            width: '200px'
          }}>
            @white: #fff;
          </h3>

          <ul>
            <li>This</li>
            <li>is</li>
            <li>an</li>
            <li>unordered</li>
            <li>list</li>
          </ul>

          <ol>
            <li>This</li>
            <li>is</li>
            <li>an</li>
            <li>ordered</li>
            <li>list</li>
          </ol>

          <div>
            <strong>strong</strong>
          </div>
          <div>
            <em>em</em>
          </div>
          <div>
            <small>small</small>
          </div>
          <div>
            <p>
              This is the first paragraph of text.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
            <p>
              This is the last paragraph of text.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Library;
