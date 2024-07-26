---
title: ReactUnitestWithJest
author: TomasLin
date: 2017-07-31
categories: Javascript
tags: 
  - React
  - Javascript
---

# Setup

## Create React App

[Run the test](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests)

## Without Create React App

```
  $ npm install --save-dev jest babel-jest babel-preset-es2015 babel-preset-react react-test-renderer
```

.babelrc

```json
  {
    "presets": ["es2015", "react"]
  }
```

先寫一個 React Component Link Example

Link.js

```javascript
import React from 'react';

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

export default class Link extends React.Component {

  constructor(props) {
    super(props);

    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onMouseEnter() {
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave() {
    this.setState({class: STATUS.NORMAL});
  }

  render() {
    return (
      <a
        className={this.state.class}
        href={this.props.page || '#'}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}>
        {this.props.children}
      </a>
    );
  }

}
```

`__tests__/Link.test.js`

```javascript
import React from 'react';
import Link from '../Link.react';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
```

`__tests__/__snashots__/Link.test.js.snap`

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Link changes the class when hovered 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 2`] = `
<a
  className="hovered"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 3`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

測試的時候每次呼叫 `toMatchSnapshot` 的時候

會依序會依序在 `__tests__/__snashots__/Link.test.js.snap` 中

取得取得 Mock 做比對

需要完全吻合才會回傳正確

## DOM Testing

上述的範例是單純比較依據不同的 Input 後造成的 Component 比對

若是你需要操作這些實體化的 `Component` 則可以使用 [Enzyme](http://airbnb.io/enzyme/) 或是 React 的 

[TestUtils](http://facebook.github.io/react/docs/test-utils.html)

而下述範例則使用 **Enzyme**

### Example

CheckboxWithLabel.js

```javascript
import React from 'react';

export default class CheckboxWithLabel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isChecked: false};

    // bind manually because React class components don't auto-bind
    // http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.setState({isChecked: !this.state.isChecked});
  }

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}
```

使用 Enzyme 的 [shallow renderer](http://airbnb.io/enzyme/docs/api/shallow.html)

`__tests__/CheckboxWithdLabel.test.js`

```javascript

import React from 'react';
import {shallow} from 'enzyme';
import CheckboxWithLabel from '../CheckboxWithLabel';

test('CheckboxWithLabel changes the text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />
  );

  expect(checkbox.text()).toEqual('Off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');
});
```

## 參考資料

[jest Testing React Apps](https://facebook.github.io/jest/docs/tutorial-react.html#content)