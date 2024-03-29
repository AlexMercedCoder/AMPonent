# AMPonent

## Web Componenet Creation Library

### by Alex Merced of AlexMerced.com

---

## About

AMPonent is Alex Merced's newest Web Component Building Library for making reusable reactive web components easier without a complex build process.

## Installation

### CDN

```
<script src="https://res.cloudinary.com/dithdroai/raw/upload/v1629464347/libraries/ponent_b6y1uh.js" charset="utf-8" defer></script>
```

### Webpack Build

`npx create-amponent-app projectName`

### NPM

```
npm i amponent
```

in your javascript file

```
const AMPonent = require("amponent")
```

### ES6 Module

index.html

```
<script type="module" src="app.js" charset="utf-8" defer></script>
```

app.js

```
import AMPonent from "https://res.cloudinary.com/dithdroai/raw/upload/v1629464347/libraries/ponentmod_z0ukid.js"

```

---

## AMPonent.make

AMPonent.make is the main function for creating web components, the function signature is.

_AMPonent.make(name, config)_

### name

This is the name of the resulting html tag which MUST be kebab case. So if you pass in "my-component" the resulting html tag to use the component will be `<my-component>`.

### config

config is an object which can have the following properties

**render**: this takes a function which should return a template a string, the signature of the function should be (box, props, element) => `template string`

**box**: this should be an object of variables to be used throughout your component, think of this as state in react or data in vue.

**beforeFirst**: A function that runs before the first render, the signature is (box, props, element) => {}

**afterFirst**: A function that runs after the first render, the signature is (box, props, element) => {}

**before**: A function that runs before every render, the signature is (box, props, element) => {}

**after**: A function that runs after every render, the signature is (box, props, element) => {}, this function is the perfect place to wire event listeners on your template.

**destroy**: A function that runs when component is removed from DOM, the signature is (box, props, element) => {}

**pretty**: function that should return a string of css styles to go in the components style tag, function signature is (box, props) => `h1 {color: red} div {display: flex}`

**reducer**: A function that run when the dispatch method is invoked, the function signature is (box, props, payload, element) => {}, the return value will use to update the box.

**funcs**: An object of other methods you'd like available to use by your component, if you want to be able to use the this keyword in the function to access state and props then write it as anything but an arrow function (object method or function declaration).

#### Other Properties

- **this.\$s(query)**: Equivalent to this.shadowRoot.querySelector
- **this.\$sa(query)**: Equivalent to this.shadowRoot.querySelectorAll
- **this.\$id(query)**: Equivalent to this.shadowRoot.getElementById

#### Methods

**this.stuffBox(newStuff)** pass an object of properties to this function and they'll be added/updated in the components box, the component will then be re-rendered triggering the before, render and after functions in that order.

**this.dispatch(payload)** like redux or react useReducer hook, a payload is passed into this function which passes the box, props and payload into the reducer function whose return value will be passed into the stuffBox method updating the box.

---

## AMPonent.captureProps(element)

Pass any DOM element into this function and it will return an object of its attributes/properties

---

## AMPonent.makeStyle(name, target, style)

This creates a component for styling its children, similar to React Styled Components.

#### name

This is the name of the resulting html tag which MUST be kebab case. So if you pass in "my-component" the resulting html tag to use the component will be <my-component>.

#### target

This is a string that names the target child, so if this component is meant to style an h1 element that is its child, this would be "h1". If you want to style any child then you can pass "\*".

#### style

This is a string of the style to be applied to the target, for example "color: red; padding: 5px; font-family: Arial;"

## Example of declaring components in your javascript

```javascript
////////////////////////
//<hello-world> component
////////////////////////

AMPonent.make("hello-world", {
  render: (box, props) => `<h1>Hello WOrld</h1>`,
});

////////////////////////
//<super-cheese> component
////////////////////////

AMPonent.make("super-cheese", {
  render: function (box, props, el) {
    console.log(el);
    return `<h1>${box.hello}</h1> ${el.test} <button id="button">Click Me</button>`;
  },
  box: { hello: "Hello World" },
  funcs: {
    test: () => "Say Hi",
  },
  firstBefore: function (box, props, el) {
    console.log("before first render");
  },
  firstAfter: function (box, props, el) {
    console.log("after first render");
  },
  before: function (box, props, el) {
    console.log("before");
  },
  after: function (box, props, el) {
    el.$s("#button").addEventListener("click", (event) => {
      el.stuffBox({ hello: "Goodbye World" });
    });
  },
});

////////////////////////
//<red-h1> component
////////////////////////

AMPonent.makeStyle("red-h1", "h1", "color: var(--the-color);");
```

## Example of using Components in your HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="ponent.js"></script>
    <script src="app.js" defer></script>
  </head>
  <body>
    <style>
      :root {
        --the-color: green;
      }
    </style>
    <super-cheese cheese="gouda"></super-cheese>
    <red-h1><h1>Hello World</h1></red-h1>
  </body>
</html>
```

## Sharing Data with DataShare

To more easily share data between components or accross your app you can create a dataShare object

```js
const ds = AMPonent.createDataShare({
  initialState: {
    count: 0,
  },
});
```

This object can have it's properties changed freely, allowing components to use it as a stored of shared data. You can also register functions to it that are passed the state so you can control when updates occur (instead of immediately after each property change.) So you can batch changes to the dataShare then trigger updates afterwards.

Below is an example of binding a cfunction to dataShare updates.

```js
// register a function to update the components box when datashare runs update function
ds.register((datashare) =>
  document
    .querySelect("component-component")
    .stuffBox({ count: datashare.count })
);

function addOne() {
  ds.count += 1; // update the datashare
  ds.update(); // run all registered functions
}
```
