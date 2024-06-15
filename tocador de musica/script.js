const songname = document.getElementById('song-name');
const bandname = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeBotton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleBotton = document.getElementById('shuffle');
const repeatBotton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const One_RightNow = {
    songname : 'One Right Now',
    artist : 'The Weeknd and Post Malone',
    file :'One Right Now',
    liked : false,
};
const Blinding_Lights = {
    songname : 'Blinding Lights',
    artist : 'The Weeknd',
    file :'Blinding Lights',
    liked : false,
};
const Save_YourTears = {
    songname : 'Save Your Tears',
    artist : 'The Weeknd',
    file :'Save Your Tears',
    liked : false,

};
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;


const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [One_RightNow,Blinding_Lights,Save_YourTears] ;
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle');
    play.querySelector('.bi').classList.add('bi-pause-circle');
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle');
    play.querySelector('.bi').classList.remove('bi-pause-circle');
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }
}

function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songname.innerText = sortedPlaylist[index].songname;
    bandname.innerText = sortedPlaylist[index].artist;
    LikeBottonRender();
}

function PreviousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index -= 1;
    }
    initializeSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else{
        index += 1;
    }
    initializeSong();
    playSong();
}

function LikeBottonRender(){
    if (sortedPlaylist[index].liked === true) {
        likeBotton.querySelector('.bi').classList.remove('bi-heart');
        likeBotton.querySelector('.bi').classList.add('bi-heart-fill');
        likeBotton.classList.add('botton-active');
    }
    else {
        likeBotton.querySelector('.bi').classList.add('bi-heart');
        likeBotton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeBotton.classList.remove('botton-active');
    }
}

function updateProgress(){

    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const JumpToTime = (clickPosition/width)*song.duration;
    song.currentTime = JumpToTime;

}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0 ){
       let randomIndex = Math.floor(Math.random()*size);
       let aux = preShuffleArray[currentIndex];
       preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
       preShuffleArray[randomIndex] = aux;
       currentIndex -= 1;
    }

}

function shuffleBottonClicked(){
    if(isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleBotton.classList.add('botton-active');
    }
    else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleBotton.classList.remove('botton-active');
    }

}

function repeatBottonClicked(){
    if(repeatOn === false){
        repeatOn = true;
        repeatBotton.classList.add('botton-active');
    }
    else{
        isrepeatOn = false;
        repeatBotton.classList.remove('botton-active');
    }

}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS( originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return  `${hours.toString().padStart(2,'0')}:${min.toString()
        .padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);

}

function likeBottonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }else{
        sortedPlaylist[index].liked = false ;
    }
    LikeBottonRender();
    localStorage.setItem('playlist', 
    JSON.stringify(originalPlaylist)
    );
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', PreviousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click',jumpTo);
shuffleBotton.addEventListener('click', shuffleBottonClicked);
repeatBotton.addEventListener('click', repeatBottonClicked);
likeBotton.addEventListener('click', likeBottonClicked);