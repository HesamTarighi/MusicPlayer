import Component from './Component.js'

export default class extends Component {
    constructor (data) {
        super()

        this.data = data
        this.current_audio = 1
        this.audio = new Audio(this.data[this.current_audio -1].path)
        this.audio_modes = ['repeat', 'next', 'random']
        this.audio_mode = 'repeat'
        this.els = {
            card: document.getElementById('music_player_card'),
            wave: document.getElementById('wave'),
            titles: {
                title_box: document.getElementById('title'),
                artist_name: document.getElementById('artist_name'),
                music_name: document.getElementById('music_name')
            },
            buttons: {
                toggle_play: document.getElementById('toggle_btn')
            },
            times: {
                current_time: document.getElementById('current_time'),
                duration: document.getElementById('duration'),
                slider: document.getElementById('slider')
            },
            audios_menu: {
                menu: document.querySelector('#audio_menu ul'),
                lists: []
            },
            modes: {
                repeat: document.getElementById('repeat_mode'),
                next: document.getElementById('next_mode'),
                random: document.getElementById('random_mode')
            }
        }
    }

    calculateTimeSec (time) {
        return parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60)
    }
    calculateTimeMin (time) {
        return parseInt(parseInt(time) / 60)
    }
    setAudioInfo () {
        this.els.titles.artist_name.innerHTML = this.data[this.current_audio -1].artist
        this.els.titles.music_name.innerHTML = this.data[this.current_audio -1].title || this.data[this.current_audio -1].file_name.split('.')[0]
        this.els.card.style.background = `url('${this.data[this.current_audio -1].picture}')`
    }
    play () {
        this.els.buttons.toggle_play.querySelector('i').className = 'fas fa-pause'

        this.audio.play()
        this.els.wave.classList.add('wave-play')
    }
    pause () {
        this.els.buttons.toggle_play.querySelector('i').className = 'fas fa-play'

        this.audio.pause()
        this.els.wave.classList.remove('wave-play')
    }
    next () {
        this.els.titles.title_box.classList.add('music-changed')
        setTimeout(() => {
            this.els.titles.title_box.classList.remove('music-changed')

            if (this.current_audio < this.data.length) this.current_audio++
            else this.current_audio = 1
            this.setAudioInfo()
            this.pause()
            this.audio = new Audio(this.data[this.current_audio -1].path)
            this.activeList()
            this.play()
        }, 500)
    }
    prev () {
        this.els.titles.title_box.classList.add('music-changed')
        setTimeout(() => {
            this.els.titles.title_box.classList.remove('music-changed')

            if (this.current_audio > 1) this.current_audio--
            else this.current_audio = this.data.length
            this.setAudioInfo()
            this.pause()
            this.audio = new Audio(this.data[this.current_audio -1].path)
            this.activeList()
            this.play()
        }, 500);
    }
    repetAudioMode () {
        this.pause()
        this.audio.currentTime = 0
        this.play()
    }
    nextAudioMode () {
        this.pause()
        this.audio.currentTime = 0
        this.next()
    }
    randomAudioMode () {
        this.pause()
        this.audio.currentTime = 0
        this.current_audio = Math.floor(Math.random() * this.data.length -1)
        this.next()
    }
    changeAuidoMode (mode) {
        this.els.modes.repeat.classList.add('hidden')
        this.els.modes.next.classList.add('hidden')
        this.els.modes.random.classList.add('hidden')
        this.els.modes[mode].classList.remove('hidden')

        this.audio_mode = mode
    }
    checkAudioMode () {
        switch (this.audio_mode) {
            case 'repeat':
                this.repetAudioMode()
                break;

            case 'next':
                this.nextAudioMode()
                break;

            case 'random':
                this.randomAudioMode()
                break;
        }
    }
    audioTime () {
        this.els.times.slider.addEventListener('input', () => {
            sliderFill('#ffffff37', '#fff')
            changeTime()
        })

        const changeTime = () => this.audio.currentTime = this.els.times.slider.value
        const sliderFill = (bg_color, fill) => {
            const percentage = (100 * (this.els.times.slider.value - this.els.times.slider.min)) / (this.els.times.slider.max - this.els.times.slider.min)
            const bg = `linear-gradient(90deg, ${fill || '#0B1EDF'} ${percentage}%, ${bg_color || '#ffffff37'} ${percentage +0.1}%)`

            this.els.times.slider.style.background = bg
        }

        setInterval(() => {
            sliderFill('#ffffff37', '#fff')

            const audio_current_sec = this.calculateTimeSec(this.audio.currentTime)
            const audio_current_min = parseInt(this.audio.currentTime / 60)

            this.els.times.duration.innerHTML = parseInt(parseInt(this.audio.duration) / 60) + ':' + this.calculateTimeSec(parseInt(this.audio.duration))
            this.els.times.slider.setAttribute('max', this.audio.duration)
            this.els.times.current_time.innerHTML = audio_current_min + ':' + audio_current_sec
            this.els.times.slider.value = this.audio.currentTime

            if (this.audio.currentTime == this.audio.duration) this.checkAudioMode()
        }, 100)
    }
    setAudiosMenu () {
        for (let i = 0; i < this.data.length; i++) {
            const list_audio = new Audio(this.data[i].path)
            const list = document.createElement('li')
            const titles_box = document.createElement('div')
            list.id = 'audio_menu_list'
            list.className = 'px-6 flex flex-col items-between cursor-pointer'
            titles_box.className = 'border-b border-[#00000020] py-3 flex justify-between'

            this.els.audios_menu.lists.push(list)

            list.addEventListener('click', () => {
                this.current_audio = i +1
                this.activeList()
                this.pause()
                this.setAudioInfo()
                this.audio = new Audio(this.data[this.current_audio -1].path)
                this.play()
            })
            setInterval(() => {
                if (i + 1 == this.current_audio) document.querySelectorAll('.audio-time')[i].innerHTML = this.calculateTimeMin(this.audio.currentTime) + ':' + this.calculateTimeSec(this.audio.currentTime)
                else document.querySelectorAll('.audio-time')[i].innerHTML = this.calculateTimeMin(list_audio.duration) + ':' + this.calculateTimeSec(list_audio.duration)
            }, 100)
            this.createComponent('span', titles_box, {text: this.data[i].title || this.data[i].file_name})
            this.createComponent('span', titles_box, {props: {class: 'audio-time'}})
            list.appendChild(titles_box)
            this.els.audios_menu.menu.appendChild(list)
        }
    }
    activeList () {
        this.els.audios_menu.lists.forEach(li => li.classList.remove('actived-audio'))
        this.els.audios_menu.lists[this.current_audio -1].classList.add('actived-audio')
    }
}
