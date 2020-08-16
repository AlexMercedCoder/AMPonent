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
  render: function (box, props) {
    console.log(this);
    return `<h1>${box.hello}</h1> ${this.useFunc(
      "test"
    )} <button id="button">Click Me</button>`;
  },
  box: { hello: "Hello World" },
  funcs: {
    test: (box, props) => "Say Hi",
  },
  firstBefore: function (box, props) {
    console.log("before first render");
  },
  firstAfter: function (box, props) {
    console.log("after first render");
  },
  before: function (box, props) {
    console.log("before");
  },
  after: function (box, props) {
    this.$s("#button").addEventListener("click", (event) => {
      this.stuffBox({ hello: "Goodbye World" });
    });
  },
});

////////////////////////
//<red-h1> component
////////////////////////

AMPonent.makeStyle("red-h1", "h1", "color: var(--the-color);");
