import Component from './Component.js'

export default class extends Component {
    constructor (data) {
        super()

        this.data = data
        this.els = {
            card: document.getElementById('albums_card')
        }

        this.createAlbum()
    }

    editMode () {
        const box = document.getElementById(`album_options_box_${this.data.id}`)
        const edit_mode = box.querySelectorAll('.album-edit-mode')
        const view_mode = box.querySelectorAll('.album-view-mode')

        box.classList.remove('gap-6')
        box.classList.add('gap-2')
        box.classList.add('flex-col')
        for (let j = 0; j < edit_mode.length; j++) edit_mode[j].classList.remove('hidden')
        for (let j = 0; j < view_mode.length; j++) view_mode[j].classList.add('hidden')
    }
    viewMode () {
        const box = document.getElementById(`album_options_box_${this.data.id}`)
        const edit_mode = box.querySelectorAll('.album-edit-mode')
        const view_mode = box.querySelectorAll('.album-view-mode')

        box.classList.add('gap-6')
        box.classList.remove('gap-2')
        box.classList.remove('flex-col')
        for (let j = 0; j < edit_mode.length; j++) edit_mode[j].classList.add('hidden')
        for (let j = 0; j < view_mode.length; j++) view_mode[j].classList.remove('hidden')
    }
    createAlbum () {
        const album = document.createElement('div')
        album.className = 'h-full relative album-box'

        this.createComponent('div', album,
            {
                props: {
                    class: 'w-full h-full bg-black/50 rounded-md absolute flex items-center justify-center gap-6 album-options-box',
                    id: `album_options_box_${this.data.id}`
                }
            }
        ).then(parent => {
            // View mode
            this.createComponent('div', parent,
                {
                    props: {class: 'px-2 py-1 flex justify-between gap-4 album-view-mode album-name-inp-box'}
                }
            ).then(box => {
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-full px-[14px] py-[10px] text-white edit-album-btn'},
                        text: '<i class="fas fa-pen"></i>',
                        events: [{event_name: 'click', listener: () => this.editMode()}]
                    }
                )
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-full px-[14px] py-[10px] text-white remove-album-btn'},
                        text: '<i class="fas fa-trash"></i>',
                        events: [{event_name: 'click', listener: () => this.removeAlbum(this.data.id)}]
                    }
                )
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-full px-[14px] py-[10px] text-white remove-album-btn'},
                        text: '<i class="fas fa-arrow-right"></i>',
                        events: [{event_name: 'click', listener: () => ipcRenderer.send('SELECT_ALBUM', this.data)}]
                    }
                )
            })
            // Edit mode
            this.createComponent('div', parent,
            {
                props: {class: 'px-2 py-1 hidden flex justify-between gap-4 album-edit-mode album-name-inp-box'}
            }
            ).then(box => {
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-full px-[15px] py-[8px] relative text-white/70 __circle-down close-edit-album-btn'},
                        text: '<i class="fas fa-close"></i>',
                        events: [{event_name: 'click', listener: () => this.viewMode()}]
                    }
                )
            })
            this.createComponent('div', parent,
                {
                    props: {class: 'w-[95%] bg-black/40 border border-red-400 rounded-full px-2 py-1 hidden flex justify-between gap-1 album-edit-mode album-name-inp-box'}
                }
            ).then(box => {
                this.createComponent('input', box,
                    {
                        props: {class: 'w-full bg-transparent outline-none text-white/70 font-sm album-name-inp'},
                        events: [{event_name: 'input', listener: e => this.editAlbumName(this.data.id, e.target.value)}]
                    }
                )
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-full px-[7px] py-[2px] relative text-white/70 submit-edit-album-btn'},
                        text: '<i class="fas fa-check"></i>',
                        events: [{event_name: 'click', listener: () => ipcRenderer.send('SUBMIT_ALBUM_EDITED')}]
                    }
                )
            })
            this.createComponent('div', parent,
                {
                    props: {class: 'px-2 py-1 hidden flex justify-between gap-4 album-edit-mode album-name-inp-box'}
                }
            ).then(box => {
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-md px-[19px] py-[7px] hidden relative text-white album-edit-mode edit-album-music-btn'},
                        text: '<i class="fas fa-image"></i>',
                        events: [{event_name: 'click', listener: () => this.editAlbumPicture(this.data.id)}]
                    }
                )
                this.createComponent('button', box,
                    {
                        props: {class: 'bg-red-400 hover:bg-red-500 border-none rounded-md px-[19px] py-[7px] hidden relative text-white album-edit-mode edit-album-cover-btn'},
                        text: '<i class="fas fa-music"></i>',
                        events: [{event_name: 'click', listener: () => this.editAlbumAudios(this.data.id)}]
                    }
                )
            })
        })
        this.createComponent('img', album,
            {
                props: {class: 'w-full h-full rounded-md object-cover', src: this.data.picture},
                events: [
                    {event_name: 'click', listener: () => this.selectAlbum(this.data)}
                ]
            }
        )
        this.createComponent('span', album,
            {
                props: {class: 'text-white/70'},
                text: this.data.name
            }
        )
        this.els.card.appendChild(album)
    }
    selectAlbum (data) {
        ipcRenderer.send('SELECT_ALBUM', data)
    }
    removeAlbum (id) {
        ipcRenderer.send('REMOVE_ALBUM', id)
    }
    editAlbumPicture (id) {
        ipcRenderer.send('EDIT_ALBUM_PICTURE', id)
    }
    editAlbumAudios (id) {
        ipcRenderer.send('EDIT_ALBUM_AUDIOS', id)
    }
    editAlbumName (id, name) {
        ipcRenderer.send('EDIT_ALBUM_NAME', {id, props: { name }})
    }
}
