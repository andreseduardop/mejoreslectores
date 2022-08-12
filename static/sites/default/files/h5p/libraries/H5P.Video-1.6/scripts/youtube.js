H5P.VideoYouTube=(function($){function YouTube(sources,options,l10n){var self=this;var player;var playbackRate=1;var id='h5p-youtube-'+numInstances;numInstances++;var $wrapper=$('<div/>');var $placeholder=$('<div/>',{id:id,text:l10n.loading}).appendTo($wrapper);var create=function(){if(!$placeholder.is(':visible')||player!==undefined){return;}
if(window.YT===undefined){loadAPI(create);return;}
if(YT.Player===undefined){return;}
var width=$wrapper.width();if(width<200){width=200;}
var loadCaptionsModule=true;var videoId=getId(sources[0].path);player=new YT.Player(id,{width:width,height:width*(9/16),videoId:videoId,playerVars:{origin:ORIGIN,autoplay:0,controls:options.controls?1:0,disablekb:options.controls?0:1,fs:0,loop:options.loop?1:0,playlist:options.loop?videoId:undefined,rel:0,showinfo:0,iv_load_policy:3,wmode:"opaque",start:options.startAt,playsinline:1},events:{onReady:function(){self.trigger('ready');self.trigger('loaded');},onApiChange:function(){if(loadCaptionsModule){loadCaptionsModule=false;player.loadModule('captions');}
var trackList;try{trackList=player.getOption('captions','tracklist');}
catch(err){}
if(trackList&&trackList.length){var trackOptions=[];for(var i=0;i<trackList.length;i++){trackOptions.push(new H5P.Video.LabelValue(trackList[i].displayName,trackList[i].languageCode));}
self.trigger('captions',trackOptions);}},onStateChange:function(state){if(state.data>-1&&state.data<4){if(H5P.Video.IE11_PLAYBACK_RATE_FIX&&state.data===H5P.Video.PLAYING&&playbackRate!==1){player.setPlaybackRate(1);player.setPlaybackRate(playbackRate);}
self.trigger('stateChange',state.data);}},onPlaybackQualityChange:function(quality){self.trigger('qualityChange',quality.data);},onPlaybackRateChange:function(playbackRate){self.trigger('playbackRateChange',playbackRate.data);},onError:function(error){var message;switch(error.data){case 2:message=l10n.invalidYtId;break;case 100:message=l10n.unknownYtId;break;case 101:case 150:message=l10n.restrictedYt;break;default:message=l10n.unknownError+' '+error.data;break;}
self.trigger('error',message);}}});};self.pressToPlay=navigator.userAgent.match(/iPad/i)?true:false;self.appendTo=function($container){$container.addClass('h5p-youtube').append($wrapper);create();};self.getQualities=function(){if(!player||!player.getAvailableQualityLevels){return;}
var qualities=player.getAvailableQualityLevels();if(!qualities.length){return;}
for(var i=0;i<qualities.length;i++){var quality=qualities[i];var label=(LABELS[quality]!==undefined?LABELS[quality]:'Unknown');qualities[i]={name:quality,label:LABELS[quality]};}
return qualities;};self.getQuality=function(){if(!player||!player.getPlaybackQuality){return;}
var quality=player.getPlaybackQuality();return quality==='unknown'?undefined:quality;};self.setQuality=function(quality){if(!player||!player.setPlaybackQuality){return;}
player.setPlaybackQuality(quality);};self.play=function(){if(!player||!player.playVideo){self.on('ready',self.play);return;}
player.playVideo();};self.pause=function(){self.off('ready',self.play);if(!player||!player.pauseVideo){return;}
player.pauseVideo();};self.seek=function(time){if(!player||!player.seekTo){return;}
player.seekTo(time,true);};self.getCurrentTime=function(){if(!player||!player.getCurrentTime){return;}
return player.getCurrentTime();};self.getDuration=function(){if(!player||!player.getDuration){return;}
return player.getDuration();};self.getBuffered=function(){if(!player||!player.getVideoLoadedFraction){return;}
return player.getVideoLoadedFraction()*100;};self.mute=function(){if(!player||!player.mute){return;}
player.mute();};self.unMute=function(){if(!player||!player.unMute){return;}
player.unMute();};self.isMuted=function(){if(!player||!player.isMuted){return;}
return player.isMuted();};self.getVolume=function(){if(!player||!player.getVolume){return;}
return player.getVolume();};self.setVolume=function(level){if(!player||!player.setVolume){return;}
player.setVolume(level);};self.getPlaybackRates=function(){if(!player||!player.getAvailablePlaybackRates){return;}
var playbackRates=player.getAvailablePlaybackRates();if(!playbackRates.length){return;}
return playbackRates;};self.getPlaybackRate=function(){if(!player||!player.getPlaybackRate){return;}
return player.getPlaybackRate();};self.setPlaybackRate=function(newPlaybackRate){if(!player||!player.setPlaybackRate){return;}
playbackRate=Number(newPlaybackRate);player.setPlaybackRate(playbackRate);};self.setCaptionsTrack=function(track){player.setOption('captions','track',track?{languageCode:track.value}:{});};self.getCaptionsTrack=function(){var track=player.getOption('captions','track');return(track.languageCode?new H5P.Video.LabelValue(track.displayName,track.languageCode):null);};self.on('resize',function(){if(!$wrapper.is(':visible')){return;}
if(!player){create();return;}
$wrapper.css({width:'100%',height:'100%'});var width=$wrapper[0].clientWidth;var height=options.fit?$wrapper[0].clientHeight:(width*(9/16));if(height>0){$wrapper.css({width:width+'px',height:height+'px'});player.setSize(width,height);}});}
YouTube.canPlay=function(sources){return getId(sources[0].path);};var getId=function(url){var matches=url.match(/(?:(?:youtube.com\/(?:attribution_link\?(?:\S+))?(?:v\/|embed\/|watch\/|(?:user\/(?:\S+)\/)?watch(?:\S+)v\=))|(?:youtu.be\/|y2u.be\/))([A-Za-z0-9_-]{11})/i);if(matches&&matches[1]){return matches[1];}};var loadAPI=function(loaded){if(window.onYouTubeIframeAPIReady!==undefined){var original=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(id){loaded(id);original(id);};}
else{var tag=document.createElement('script');tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName('script')[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);window.onYouTubeIframeAPIReady=loaded;}};var LABELS={highres:'2160p',hd2160:'2160p',hd1440:'1440p',hd1080:'1080p',hd720:'720p',large:'480p',medium:'360p',small:'240p',tiny:'144p',auto:'Auto'};var numInstances=0;var ORIGIN=window.location.href.match(/http[s]?:\/\/[^\/]+/);ORIGIN=!ORIGIN||ORIGIN[0]===undefined?undefined:ORIGIN[0];return YouTube;})(H5P.jQuery);H5P.videoHandlers=H5P.videoHandlers||[];H5P.videoHandlers.push(H5P.VideoYouTube);