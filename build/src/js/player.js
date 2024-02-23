
class playerYTClass {
    constructor(playerEl,playerElParent) {
        this.playerEl = playerEl;
        this.playerContainer = playerElParent;
        this.ytID = playerEl.dataset.id;
        this.player = new YT.Player(this.playerEl,{
            videoId:this.ytID,
            events:{
                'onStateChange': this.onPlayerPause.bind(this),
                'onReady': this.onPlayerReady.bind(this),
            }
            });
        this.event = new CustomEvent("playingYTNow", {
            detail: { player: this.player },
        });
        window.addEventListener('playingYTNow',this.windowPlayingHandler.bind(this))
    }
   
    onPlayerPause(){
        if(this.player.data==2){ 
            this.playerContainer.classList.add('disabled');
            let pauser = setTimeout(()=>{
                if(this.player.getPlayerState()==2){
                    this.playerContainer.classList.remove("playing")
                }
                else{
                    clearTimeout(pauser);
                }
            }, 1000);
        }
        else{
            this.playerContainer.classList.remove('disabled');
        }
    }
    
    onPlayerReady(){
        if(!this.playerContainer.classList.contains('has_title')){
            const playText = this.playerContainer.querySelector('.screen-reader-text');
            const title = this.player.getVideoData().title;
            if(playText){
                playText.innerHTML = `Play ${title}`;
            }
        }
        this.playerContainer.classList.add('ready');
        this.playerContainer.addEventListener('click',this.playVideo.bind(this))
    }
    
    playVideo(e){
        if(this.playerContainer.classList.contains('disabled')){return}
        if(this.player.getPlayerState()==1||this.player.getPlayerState()==3){
            this.player.pauseVideo();
        }
        else{
            this.playerContainer.classList.add('playing');
            this.player.playVideo();
            window.dispatchEvent(this.event);
        }
    }
    windowPlayingHandler(e){
        if(e.detail.player!=this.player){
            this.player.pauseVideo();
        }
    }
}

const playerWithCover = (url) =>{
    let yt_players = document.querySelectorAll('.player.youtube');
    if(!yt_players.length){return};
    if(yt_players.length){
        if (typeof YT == 'undefined') {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        
        window.onYouTubeIframeAPIReady = () => { 
            yt_players.forEach((yt_player)=>{
                const player = new playerYTClass(yt_player,yt_player.parentNode);
            }) 
        }
    }
}


export default playerWithCover;