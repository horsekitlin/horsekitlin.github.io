---
title: material-ui-themes
author: TomasLin
tags:
  - Css
  - Themes
  - Material-design
categories:
  - Css
date: 2018-11-29
---


# source

[material-ui themes](https://material-ui.com/customization/themes/#palette)

# Content

## Palette

針對 Application  設定幾個基礎色

theme 中提供幾個 key 來設定基礎色

* primary - 主要的顏色
* secondary - 次要的顏色
* error - 顯示錯誤的時候的顏色

### Custom palette

在 theme 有 `[palette.primary](https://material-ui.com/customization/default-theme/?expend-path=$.palette.primary)`, `[palette.secondary](https://material-ui.com/customization/default-theme/?expend-path=$.palette.secondary)`, `[palette.error](https://material-ui.com/customization/default-theme/?expend-path=$.palette.error)` 三個物件可以複寫

在上述三個物件中各有 `light`, `main`, `dark`, `contrastText` 四個參數可以提供修改

可以直接放入顏色的物件作設定

```javascript
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});
```

也可以依據各個不同的狀況做設定

```javascript
palette: {
  primary: {
    light: palette.primary[300],
    main: palette.primary[500],
    dark: palette.primary[700],
    contrastText: getContrastText(palette.primary[500]),
  },
  secondary: {
    light: palette.secondary.A200,
    main: palette.secondary.A400,
    dark: palette.secondary.A700,
    contrastText: getContrastText(palette.secondary.A400),
  },
  error: {
    light: palette.error[300],
    main: palette.error[500],
    dark: palette.error[700],
    contrastText: getContrastText(palette.error[500]),
  },
},
```

這個範例說明如何重新建立一個預設 palette 

```javascript
import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    // 提供 getContrastText() 使用的值，最大化背景之間的對比度
    contrastThreshold: 3,
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});
```

也可以客製化自己的顏色

```javascript
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // error: will use the default color
  },
});
```

也有提供 [color tools](https://material-ui.com/style/color/#color-tool)

### Type(light/dark theme)

你可以透過修改 `type` 改為 `dark` 來將佈景變暗

雖然只有改變一個參數

但是下述的 key 都會受到影響

* palette.text
* palette.divider
* palette.background
* palette.action

### Typography

一次太多字型 類型大小和 Style 會破壞 Layout

提供一組有限的 Style 來限制

`Typography` 可以使用在任何的 component 中

[Typography section](https://material-ui.com/style/typography/)

#### Font family

```javascript
const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
```

Material-UI 的字型大小預設使用 `rem` 但是他會依據 `<html>` 的預設字型大小改變

一般來說預設是 `16px` browser 沒有提供修改的方式

所以 `units` 提供一個方式來修改設定提升使用者體驗

修改 font-size 為 `12` 預設是 `14`

##### HTML font size

```javascript
const theme = createMuiTheme({
  typography: {
    // In Japanese the characters are usually larger.
    fontSize: 12,
    htmlFontSize: 10,
  },
});
```

瀏覽器計算字型大小是透過這個公式

![calc font size](https://material-ui.com/static/images/font-size.gif)

### Custom variables

也可以透過 `styling solution` 來客製化你的 component

```javascript
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const styles = theme => ({
  root: {
    color: theme.status.danger,
    '&$checked': {
      color: theme.status.danger,
    },
  },
  checked: {},
});

let CustomCheckbox = props =>
  <Checkbox
    defaultChecked
    classes={{
      root: props.classes.root,
      checked: props.classes.checked,
    }}
  />

CustomCheckbox = withStyles(styles)(CustomCheckbox);

const theme = createMuiTheme({
  status: {
    danger: orange[500],
  },
});

function StylingComponent() {
  return (
    <MuiThemeProvider theme={theme}>
      <CustomCheckbox />
    </MuiThemeProvider>
  );
}

export default StylingComponent;
```

### Customizing all instances of a component type

有時候要針對單一 Component 做設定的時候可以用 `overrides` 這個 keyword 來做複寫

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {purple, green, blue} from '@material-ui/core/colors';
import Example from './Example';
import { Button, Typography } from '@material-ui/core';
import ListItems from './ListItems';
import StylingComponent from './StylingComponent';

const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Button>hello</Button>
      </MuiThemeProvider>
    );
  }
}

export default App;
```

### Properties

也可以傳入 `properties` 使用

```javascript
import React, { Component } from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {purple, green, blue} from '@material-ui/core/colors';
import { Button } from '@material-ui/core';

const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiButton: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Button>hello</Button>
      </MuiThemeProvider>
    );
  }
}

export default App;
```

可以看到結果 ripple 會被 disabled

### Accessing the theme in a component

有時候會希望在某些 Component 中使用 theme 的變數

這時候可以使用 `withTheme`

範例如下

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

function WithTheme(props) {
  const { theme } = props;
  const primaryText = theme.palette.text.primary;
  const primaryColor = theme.palette.primary.main;

  const styles = {
    primaryText: {
      backgroundColor: theme.palette.background.default,
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      color: primaryText,
    },
    primaryColor: {
      backgroundColor: primaryColor,
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      color: theme.palette.common.white,
    },
  };

  return (
    <div style={{ width: 300 }}>
      <Typography style={styles.primaryColor}>{`Primary color ${primaryColor}`}</Typography>
      <Typography style={styles.primaryText}>{`Primary text ${primaryText}`}</Typography>
    </div>
  );
}

WithTheme.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme()(WithTheme); // Let's get the theme as a property
```

