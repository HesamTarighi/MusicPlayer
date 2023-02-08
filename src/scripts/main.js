import MusicPlayer from './modules/MusicPlayer.js'
import Album from './modules/Album.js'
import ElementDisplay from './modules/GlobalModules.js'

ipcRenderer.on('RENDER_MUSIC_PLAYER', (e, data) => {
    const music_player = new MusicPlayer(data)
    
    const toggle_play_btn = document.getElementById('toggle_btn')
    const next_btn = document.getElementById('next_btn')
    const prev_btn = document.getElementById('prev_btn')
    const audios_box_menu = document.getElementById('audio_menu')
    const menu_toggle_btn = document.getElementById('menu_toggle_btn')
    const menu_back_btn = document.getElementById('menu_back_btn')
    const modes = document.querySelectorAll('.modes')

    for (let i = 0; i < modes.length; i++) modes[i].addEventListener('click', e => changeMode(e))
    
    next_btn.addEventListener('click', () => music_player.next())
    prev_btn.addEventListener('click', () => music_player.prev())
    menu_toggle_btn.addEventListener('click', () => audios_box_menu.classList.toggle('actived'))
    toggle_play_btn.addEventListener('click', () => {
        if (music_player.audio.paused) music_player.play()
        else music_player.pause()
    })
    menu_back_btn.addEventListener('click', () => {
        ipcRenderer.send('CLEAR_DATABASE', 'audios')
        ipcRenderer.send('RESTART_APP')
    })
    function changeMode (e) {
        var index = music_player.audio_modes.findIndex(mode => mode == e.target.parentNode.getAttribute('data-mode'))

        if (index < music_player.audio_modes.length -1) index++
        else index = 0

        music_player.changeAuidoMode(music_player.audio_modes[index])
    }
    
    music_player.setAudioInfo()
    music_player.audioTime()
    music_player.setAudiosMenu()
    music_player.activeList()
})
ipcRenderer.on('UPLOAD', () => {
    const album_name_inp = document.getElementById('album_name_inp')
    const upload_picture_btn = document.getElementById('upload_picture_btn')
    const upload_audios_btn = document.getElementById('upload_audios_btn')
    const submit_upload_btn = document.getElementById('submit_upload_btn')

    album_name_inp.addEventListener('input', e => ipcRenderer.send('ADD_ALBUM_NAME', e.target.value))
    upload_picture_btn.addEventListener('click', () => ipcRenderer.send('ADD_ALBUM_PICTURE'))
    upload_audios_btn.addEventListener('click', () => ipcRenderer.send('ADD_ALBUM_AUDIOS'))
    submit_upload_btn.addEventListener('click', () => ipcRenderer.send('SUBMIT_ADD_ALBUM'))
})
ipcRenderer.on('ALBUMS', (e, data) => {
    const add_new_album_btn = document.getElementById('add_new_album')

    add_new_album_btn.addEventListener('click', () => ipcRenderer.send('CHANGE_STEP', 1))

    for (let i = 0; i < data.length; i++) new Album(data[i])
})
ipcRenderer.on('STEP', (e, step) => {
    switch (step) {
        case 1:
            ElementDisplay.show('upload_box')
            ElementDisplay.hide('albums_card')
            ElementDisplay.hide('music_player_card')
            break;
    
        case 2:
            ElementDisplay.show('albums_card')
            ElementDisplay.hide('upload_box')
            ElementDisplay.hide('music_player_card')
            break;
    
        case 3:
            console.log('hjkg')
            ElementDisplay.show('music_player_card')
            ElementDisplay.hide('upload_box')
            ElementDisplay.hide('albums_card')
            break;
    
        default:
            alert(0)
            break;
    }
})
