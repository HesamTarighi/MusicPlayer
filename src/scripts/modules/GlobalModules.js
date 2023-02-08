export default class {
    static show (show_el) {
        show_el = document.getElementById(show_el)

        show_el.classList.remove('hidden')
    }
    static hide (hide_el) {
        hide_el = document.getElementById(hide_el)

        hide_el.classList.add('hidden')
    }
}
