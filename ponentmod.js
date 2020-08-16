// AMPonent => by Alex Merced

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
// AMPonent
///////////////////

export default {
  make: function (name, config) {
    class C extends HTMLElement {
      constructor() {
        super();

        //attach shadowroot and abbreviate shadowroot
        this.attachShadow({ mode: "open" });
        this.$s = (q) => this.shadowRoot.querySelector(q);
        this.$sa = (q) => this.shadowRoot.querySelectorAll(q);
        this.$id = (q) => this.shadowRoot.getElementById(q);

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
        this.$ =
          //first render
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

      disconnectedCallback() {
        this.destroy(this.box, this.props);
      }
    }

    customElements.define(name, C);
  },
  captureProps,
  makeStyle: function (name, target, style) {
    class S extends HTMLElement {
      constructor() {
        super();

        //make shadowdom
        this.attachShadow({ mode: "open" });

        //the template
        this.shadowRoot.innerHTML = `
        <style> ::slotted(${target}){
          ${style}
        } </style>

        <span><slot></slot><span>
        `;
      }
    }

    customElements.define(name, S);
  },
};
