console.log("Let's write Javascript")
let currentSong = new Audio()
let play = document.getElementById('play')
let previous = document.getElementById('previous');
let next = document.getElementById('next')
let index = 0;
async function getSongs() {
    
    let a = await fetch(`http://127.0.0.1:5500/songs`)
    let response = await a.text()
    // console.log(response);

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    // console.log(a);


    songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs

}

function playMusic(songName, pause=false) {
    currentSong.src = songName;
    if(!pause){
        currentSong.play(); 
        play.className = "bi bi-pause-circle"
    }
    document.querySelectorAll('.playNow').forEach(value =>{
        if(value.parentElement.id == songName){
            value.className = "bi bi-pause-circle playNow"
            value.addEventListener('click', ()=>{
                if(currentSong.paused){
                    currentSong.play();
                    value.className = "bi bi-pause-circle playNow"
                    play.className = "bi bi-pause-circle"
                }
                else{
                    currentSong.pause();
                    value.className = "bi bi-play-circle playNow"
                    play.className = "bi bi-play-circle"
                }
            })
        }
    })

    document.getElementById('songInfo').innerHTML = `${songName.replaceAll("%20", " ").replace("http://127.0.0.1:5500/songs/", " ").slice(0, 20)}...`
}

async function init() {
    const songs = await getSongs()
    // console.log(songs[0]);
    playMusic(songs[0], true)


    // Function seconds to minute.
    function secondsToMinute(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00"
        }
        else {
            const minutes = Math.floor(seconds / 60);
            const remaningSeconds = Math.floor(seconds % 60)

            const formatedMinutes = String(minutes).padStart(2, '0')
            const formattedSeconds = String(remaningSeconds).padStart(2, '0')

            return `${formatedMinutes}:${formattedSeconds}`
        }
    }

    songs.forEach(element => {
        let songList = document.getElementById('songList')
        let li = document.createElement('li');
        li.className = "songscard flex"
        li.id = element
        li.innerHTML = `
            <div class="info flex">
            <i class="bi bi-music-note-beamed"></i>
            <p>${element.replaceAll("%20", " ").replace("http://127.0.0.1:5500/songs/", " ").slice(0, 20)}...</p>
            </div>
           <i class="bi bi-play-circle playNow"></i>
            `
        songList.appendChild(li);
    });

    // Play audio



    let list = document.getElementById('songList').getElementsByTagName('li');
    let newList = Array.from(list)
    // console.log(newList);
    newList.forEach(list => {
        Array.from(list.getElementsByClassName('playNow')).forEach(value => {
            value.addEventListener('click', () => {
                playMusic(value.parentElement.id)
            })
        })

    })



    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.className = "bi bi-pause-circle"
            // document.querySelector('.playNow').className = "bi bi-pause-circle playNow"
        }
        else {
            currentSong.pause()
            play.className = "bi bi-play-circle"
            // document.querySelector('.playNow').className = "bi bi-play-circle playNow"
           
        }
    })

    // PlayNow Event Listner
    
    // Time Update Function.
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector('.songtime').innerHTML = `${secondsToMinute(currentSong.currentTime)}:${secondsToMinute(currentSong.duration)}`

    })

    // Hamburger
    document.querySelector(".hamburger").addEventListener('click', ()=>{
        document.querySelector('.left').style.left = "0"
    })

    // Close Event listner
    document.querySelector('.close').addEventListener('click', ()=>{
        document.querySelector('.left').style.left = "-100%"
    })

    // Previous play.
    previous.addEventListener('click', ()=>{
        index = songs.indexOf(currentSong.src)
        if(index > 0){
            playMusic(songs[index-1])
        }
    })

    // Play next.
    next.addEventListener('click', ()=>{
        index = songs.indexOf(currentSong.src);
        if(index < songs.length-1){
            playMusic(songs[index+1])
            
        }
        else{
            playMusic(songs[0])
        }
    })

    document.getElementById('volumeicon').addEventListener('click', ()=>{
        document.getElementById('volume').classList.toggle('volumeChange')
    })
   document.getElementById("volume").addEventListener("change", (e)=>{
    currentSong.volume = parseInt(e.target.value)/100
    console.log(e);
   })
    
   

}

init()
