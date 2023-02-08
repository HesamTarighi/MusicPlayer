export default class {
    createComponent (el, parent, options) {
        el = document.createElement(el)
        el.innerHTML = options.text ? options.text : ''

        if (options.props) {
            const props_keys = Object.keys(options.props)
            const props_values = Object.values(options.props)

            for (let i = 0; i < props_keys.length; i++) el.setAttribute(props_keys[i], props_values[i])
        }
        if (options.events) for (let i = 0; i < options.events.length; i++) el.addEventListener(options.events[i].event_name, options.events[i].listener)

        parent.appendChild(el)
        return Promise.resolve(el)
    }
}
