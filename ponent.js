// Ponent => by Alex Merced

//////////////
//CaptureProps
/////////////

const captureProps = (element) => {
  const att = [...element.attributes];
  const entries = att.map((value) => {
    return [value.name, value.value];
  });

  return Object.fromEntries(entries);
};

////////////////////
// Ponent
///////////////////

const Ponent = {
  make: function (name, config) {
    class C extends HTMLElement {
      constructor() {
        super();

        //pulling the variables from config
        this.box = config.box ? config.box : {};
        this.props = captureProps(this);
        this.firstBefore = config.firstBefore ? config.firstBefore : () => {};
        this.firstAfter = config.firstAfter ? config.firstAfter : () => {};
        this.before = config.before ? config.before : () => {};
        this.after = config.after ? config.after : () => {};
        this.pretty = config.pretty ? config.pretty : () => "";
        this.render = config.render ? config.render : () => "";
        this.destroy = config.destroy ? config.destroy : () => {};
        this.reducer = config.reducer ? config.reducer : () => {};
        this.funcs = config.funcs ? config.funcs : {};

        //first render
        this.attachShadow({ mode: "open" });
        this.firstBefore(this.box, this.props);
        this.build(this.box, this.props);
        this.firstAfter(this.box, this.props);
      }

      build(box, props) {
        this.before(box, props);
        this.shadowRoot.innerHTML = `<style>${this.pretty(
          box,
          props
        )}</style> ${this.render(box, props)}`;
        this.after(box, props);
      }

      useFunc(name) {
        return this.funcs[name](this.box, this.props);
      }

      stuffBox(items) {
        this.box = { ...this.box, ...items };
        this.props = captureProps(this);
        this.build(this.box, this.props);
      }

      dispatch(payload) {
        this.stuffBox(this.reducer(box, props, payload));
      }
    }

    customElements.define(name, C);
  },
  captureProps,
};
