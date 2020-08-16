Ponent.make('hello-world', {
    render: (box, props) => `<h1>Hello WOrld</h1>`
})

Ponent.make('super-cheese', {
    render: function(box, props){
        console.log(this)
        return `<h1>${props.cheese}</h1> ${this.useFunc('test')}`
    },
    funcs: {
        test: (box, props) => "Say Hi"
    },
    before
})