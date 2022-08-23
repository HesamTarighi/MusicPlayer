const {ipcRenderer} = require('electron')

ipcRenderer.send('CALL_RENDERER_EVENT')

ipcRenderer.on('ALBUM_STATUS', (e, status) => {
    function checkStatus() {
        const card = document.querySelector('.card')
        const upload_box = document.getElementById('upload_box')

        if (status == 1) {
            card.style.display = 'flex'
            upload_box.style.display = 'none'
        } else {
            card.style.display = 'none'
            upload_box.style.display = 'block'
        }
    }
    
    window.addEventListener('load', () => {
        checkStatus()
    })
})
ipcRenderer.on('RENDER_MUSIC_PLAYER', (e, data) => {
    console.log(data)
    var current_music = 1
    var audio = ''
    const ui = {
                inputSlider: function() {
            const slider = document.getElementById('slider')
            
            setInterval(() => sliderFill('#ffffff37', '#fff'),100)
            slider.addEventListener('input', () => sliderFill('#ffffff37', '#fff'))
            
            function sliderFill(bg_color, fill) {
                const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min)
                const bg = `linear-gradient(90deg, ${fill || '#0B1EDF'} ${percentage}%, ${bg_color || '#ffffff37'} ${percentage +0.1}%)`
                
                slider.style.background = bg
            }
        }
    }
    function calculateTimeSec(time) {
        return parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60)
    }
    function calculateTimeMin(time) {
        return parseInt(parseInt(time) / 60)
    }
    function createComponent(el, parent, options) {
        el = document.createElement(el)

        el.innerHTML = options.text
        el.className = options.class

        parent.appendChild(el)

        return el
    }
    function setAudioInfo() {
        const artist_name = document.getElementById('artist_name')
        const music_name = document.getElementById('music_name')
        const card = document.querySelector('.card')
        const undefined_picture = 'https://picsum.photos/seed/picsum/800/?grayscale'
        var base64String = ''
        var picture = ''
        
        
        artist_name.innerHTML = data[current_music -1].artist
        music_name.innerHTML = data[current_music -1].title || data[current_music -1].file_name.split('.')[0]
        
        if (data[current_music -1].picture) {
            for (var i = 0; i < data[current_music -1].picture.data.length; i++) {
                base64String += String.fromCharCode(data[current_music -1].picture.data[i])
            }
            
            picture = "data:" + data[current_music -1].picture.format + ";base64," + window.btoa(base64String)
        } else picture = undefined_picture
        
        card.style.background = `url('${picture}')`
    }
    function toggleAudio(auto_play, auto_pause) {
        const toggle_btn = document.getElementById('toggle_btn')
        const wave = document.getElementById('wave')
        
        function play() {
            audio.play()
            toggle_btn.querySelector('i').className = 'fas fa-pause'
            wave.classList.add('wave-play')
        }
        function pause() {
            audio.pause()
            toggle_btn.querySelector('i').className = 'fas fa-play' 
            wave.classList.remove('wave-play')
        }
        
        if (auto_play) play()
        else if (auto_pause) pause()
        
        toggle_btn.addEventListener('click', () => {
            if (audio.paused) play()
            else pause()
        })
    }
    function changeAudio(auto_next, auto_prev) {
        const next_btn = document.getElementById('next_btn')
        const prev_btn = document.getElementById('prev_btn')
        const title = document.getElementById('title')

        function next() {
            title.classList.add('music-changed')
            
            setTimeout(() => {
                title.classList.remove('music-changed')
                
                if (current_music < data.length) current_music++
                else current_music = 1
                setAudioInfo()
                toggleAudio(false, true)
                audio = new Audio(data[current_music -1].path)
                toggleAudio(true)
            }, 500)
        }
        function prev() {
            title.classList.add('music-changed')
            
            setTimeout(() => {
                title.classList.remove('music-changed')
                
                if (current_music > 1) current_music--
                else current_music = data.length
                setAudioInfo()
                toggleAudio(false, true)
                audio = new Audio(data[current_music -1].path)
                toggleAudio(true)
            }, 500);
        }
        
        if (auto_next) next()
        else if(auto_prev) prev()
        
        next_btn.addEventListener('click', () => next())
        prev_btn.addEventListener('click', () => prev())
    }
    function audioTime() {
        // Dom elements
        const current_time = document.getElementById('current_time')
        const duration = document.getElementById('duration')
        const slider = document.getElementById('slider')
        
        slider.addEventListener('input', () => changeTime())
        
        const changeTime = () => audio.currentTime = slider.value
        
        setInterval(() => {
            // Audio current times
            const audio_current_sec = calculateTimeSec(audio.currentTime)
            const audio_current_min = parseInt(audio.currentTime / 60)
            
            duration.innerHTML = parseInt(parseInt(audio.duration) / 60) + ':' + calculateTimeSec(parseInt(audio.duration))
            slider.setAttribute('max', audio.duration)
            current_time.innerHTML = audio_current_min + ':' + audio_current_sec
            slider.value = audio.currentTime
        }, 100)
        setInterval(() => {
            if (audio.currentTime == audio.duration) changeAudio(true, false)
        }, 1000);
    }
    function audioList() {
        const box_menu = document.querySelector('#audio_menu')
        const menu = document.querySelector('#audio_menu ul')
        const toggle_btn = document.getElementById('menu_toggle_btn')
        
        toggle_btn.addEventListener('click', () => box_menu.classList.toggle('actived'))

        for (let i = 0; i < data.length; i++) {
            const list_audio = new Audio(data[i].path)
            const list = document.createElement('li')

            list.className = 'py-3 flex justify-between cursor-pointer'
    
            list.addEventListener('click', () => {
                current_music = i +1
                toggleAudio(false, true)
                setAudioInfo()
                audio = new Audio(data[current_music -1].path)
                toggleAudio(true)
            })
            setInterval(() => {
                if (i + 1 == current_music) document.querySelectorAll('.audio-time')[i].innerHTML = calculateTimeMin(audio.currentTime) + ':' + calculateTimeSec(audio.currentTime)
                else document.querySelectorAll('.audio-time')[i].innerHTML = calculateTimeMin(list_audio.duration) + ':' + calculateTimeSec(list_audio.duration)
            }, 100)
            createComponent('span', list, {text: data[i].title || data[i].file_name})
            createComponent('span', list, {class: 'audio-time'})
            menu.appendChild(list)
        }
    }

    window.addEventListener('load', () => {
        audio = new Audio(data[current_music -1].path)

        ui.inputSlider()
        setAudioInfo()
        toggleAudio()
        changeAudio()
        audioTime()
        audioList()
    })
})
ipcRenderer.on('UPLOAD', () => {
    function uploadAudio() {
        const upload_btn = document.getElementById('upload_btn')

        upload_btn.addEventListener('click', () => {
            ipcRenderer.send('UPLOADING')
        })
    }

    window.addEventListener('load', () => {
        uploadAudio()
    })
})
