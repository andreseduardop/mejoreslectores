H5P.VideoHtml5=(function($){function Html5(sources,options,l10n){var self=this;const getCrossOriginPath=function(source){let path=H5P.getPath(source.path,self.contentId);if(video.crossOrigin!==null&&H5P.addQueryParameter&&H5PIntegration.crossoriginCacheBuster){path=H5P.addQueryParameter(path,H5PIntegration.crossoriginCacheBuster);}
return path};const addTrack=function(trackData){if(!trackData.kind||!trackData.track.path){return;}
var track=document.createElement('track');track.kind=trackData.kind;track.src=getCrossOriginPath(trackData.track);if(trackData.label){track.label=trackData.label;}
if(trackData.srcLang){track.srcLang=trackData.srcLang;}
return track;};const setInitialSource=function(){if(qualities[currentQuality]===undefined){return;}
if(H5P.setSource!==undefined){H5P.setSource(video,qualities[currentQuality].source,self.contentId)}
else{const srcPath=H5P.getPath(qualities[currentQuality].source.path,self.contentId);if(H5P.getCrossOrigin!==undefined){var crossOrigin=H5P.getCrossOrigin(srcPath);video.setAttribute('crossorigin',crossOrigin!==null?crossOrigin:'anonymous');}
video.src=srcPath;}
if(options.poster){video.poster=getCrossOriginPath(options.poster);}
options.tracks.forEach(function(track,i){var trackElement=addTrack(track);if(i===0){trackElement.default=true;}
if(trackElement){video.appendChild(trackElement);}});};var $throbber=$('<div/>',{'class':'h5p-video-loading'});var $error=$('<div/>',{'class':'h5p-video-error'});var stateBeforeChangingQuality;var currentTimeBeforeChangingQuality;var lastState;var isLoaded=false;var playbackRate=1;var skipRateChange=false;var video=document.createElement('video');var qualities=getQualities(sources,video);var currentQuality;numQualities=0;for(let quality in qualities){numQualities++;}
if(numQualities>1&&H5P.VideoHtml5.getExternalQuality!==undefined){H5P.VideoHtml5.getExternalQuality(sources,function(chosenQuality){if(qualities[chosenQuality]!==undefined){currentQuality=chosenQuality;}
setInitialSource();});}
else{currentQuality=getPreferredQuality();if(currentQuality===undefined||qualities[currentQuality]===undefined){for(currentQuality in qualities){if(qualities.hasOwnProperty(currentQuality)){break;}}}
setInitialSource();}
video.setAttribute('webkit-playsinline','');video.setAttribute('playsinline','');video.setAttribute('preload','metadata');let controlsList='nodownload';if(options.disableFullscreen){controlsList+=' nofullscreen';}
if(options.disableRemotePlayback){controlsList+=' noremoteplayback';}
video.setAttribute('controlsList',controlsList);video.disablePictureInPicture=true;video.disableRemotePlayback=(options.disableRemotePlayback?true:false);video.controls=(options.controls?true:false);video.autoplay=false;video.loop=(options.loop?true:false);video.className='h5p-video';video.style.display='block';if(options.fit){video.style.width='100%';video.style.height='100%';}
var mapEvent=function(native,h5p,arg){video.addEventListener(native,function(){switch(h5p){case 'stateChange':if(lastState===arg){return;}
var validStartTime=options.startAt&&options.startAt>0;if(arg===H5P.Video.PLAYING&&validStartTime){video.currentTime=options.startAt;delete options.startAt;}
break;case 'loaded':isLoaded=true;if(stateBeforeChangingQuality!==undefined){return;}
if($error.is(':visible')){$error.remove();}
if(OLD_ANDROID_FIX){var andLoaded=function(){video.removeEventListener('durationchange',andLoaded,false);self.trigger(h5p);};video.addEventListener('durationchange',andLoaded,false);return;}
break;case 'error':arg=error(arguments[0],arguments[1]);break;case 'playbackRateChange':if(skipRateChange){skipRateChange=false;return;}
if(H5P.Video.IE11_PLAYBACK_RATE_FIX&&playbackRate!=video.playbackRate){video.playbackRate=playbackRate;skipRateChange=true;return;}
arg=self.getPlaybackRate();break;}
self.trigger(h5p,arg);},false);};var error=function(code,message){if(code instanceof Event){if(!code.target.error){return '';}
switch(code.target.error.code){case MediaError.MEDIA_ERR_ABORTED:message=l10n.aborted;break;case MediaError.MEDIA_ERR_NETWORK:message=l10n.networkFailure;break;case MediaError.MEDIA_ERR_DECODE:message=l10n.cannotDecode;break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:message=l10n.formatNotSupported;break;case MediaError.MEDIA_ERR_ENCRYPTED:message=l10n.mediaEncrypted;break;}}
if(!message){message=l10n.unknownError;}
$throbber.remove();$error.text(message).insertAfter(video);return message;};self.appendTo=function($container){$container.append(video);};self.getQualities=function(){var options=[];for(var q in qualities){if(qualities.hasOwnProperty(q)){options.splice(0,0,{name:q,label:qualities[q].label});}}
if(options.length<2){return;}
return options;};self.getQuality=function(){return currentQuality;};self.setQuality=function(quality){if(qualities[quality]===undefined||quality===currentQuality){return;}
setPreferredQuality(quality);if(!stateBeforeChangingQuality){stateBeforeChangingQuality=lastState;currentTimeBeforeChangingQuality=video.currentTime;var loaded=function(){video.removeEventListener('loadedmetadata',loaded,false);if(OLD_ANDROID_FIX){var andLoaded=function(){video.removeEventListener('durationchange',andLoaded,false);self.seek(currentTimeBeforeChangingQuality);};video.addEventListener('durationchange',andLoaded,false);}
else{self.seek(currentTimeBeforeChangingQuality);}
video.play();if(stateBeforeChangingQuality!==H5P.Video.PLAYING){video.pause();}
stateBeforeChangingQuality=undefined;if($error.is(':visible')){$error.remove();}};video.addEventListener('loadedmetadata',loaded,false);}
currentQuality=quality;self.trigger('qualityChange',currentQuality);self.trigger('stateChange',H5P.Video.BUFFERING);video.src=getCrossOriginPath(qualities[quality].source);video.removeAttribute('poster');};self.play=function(){if($error.is(':visible')){return;}
if(!isLoaded){video.load();}
return video.play();};self.pause=function(){video.pause();};self.seek=function(time){if(lastState===undefined){video.play();video.pause();}
video.currentTime=time;};self.getCurrentTime=function(){return video.currentTime;};self.getDuration=function(){if(isNaN(video.duration)){return;}
return video.duration;};self.getBuffered=function(){var buffered=0;for(var i=0;i<video.buffered.length;i++){var from=video.buffered.start(i);var to=video.buffered.end(i);if(video.currentTime>from&&video.currentTime<to){buffered=to;break;}}
return buffered?(buffered/video.duration)*100:0;};self.mute=function(){video.muted=true;};self.unMute=function(){video.muted=false;};self.isMuted=function(){return video.muted;};self.getVolume=function(){return video.volume*100;};self.setVolume=function(level){video.volume=level/100;};self.getPlaybackRates=function(){var playbackRates=PLAYBACK_RATES;return playbackRates;};self.getPlaybackRate=function(){return video.playbackRate;};self.setPlaybackRate=function(newPlaybackRate){playbackRate=newPlaybackRate;video.playbackRate=newPlaybackRate;};self.setCaptionsTrack=function(track){for(var i=0;i<video.textTracks.length;i++){video.textTracks[i].mode=(track&&track.value===i?'showing':'disabled');}};self.getCaptionsTrack=function(){for(var i=0;i<video.textTracks.length;i++){if(video.textTracks[i].mode==='showing'){return new H5P.Video.LabelValue(video.textTracks[i].label,i);}}
return null;};mapEvent('ended','stateChange',H5P.Video.ENDED);mapEvent('playing','stateChange',H5P.Video.PLAYING);mapEvent('pause','stateChange',H5P.Video.PAUSED);mapEvent('waiting','stateChange',H5P.Video.BUFFERING);mapEvent('loadedmetadata','loaded');mapEvent('canplay','canplay');mapEvent('error','error');mapEvent('ratechange','playbackRateChange');if(!video.controls){video.addEventListener('contextmenu',function(event){event.preventDefault();},false);}
self.on('stateChange',function(event){var state=event.data;lastState=state;if(state===H5P.Video.BUFFERING){$throbber.insertAfter(video);}
else{$throbber.remove();}});self.on('loaded',function(){nextTick(function(){var textTracks=[];for(var i=0;i<video.textTracks.length;i++){textTracks.push(new H5P.Video.LabelValue(video.textTracks[i].label,i));}
if(textTracks.length){self.trigger('captions',textTracks);}});});nextTick(function(){self.trigger('ready');});}
Html5.canPlay=function(sources){var video=document.createElement('video');if(video.canPlayType===undefined){return false;}
for(var i=0;i<sources.length;i++){var type=getType(sources[i]);if(type&&video.canPlayType(type)!==''){return true;}}
return false;};var getType=function(source){var type=source.mime;if(!type){var matches=source.path.match(/\.(\w+)$/);if(matches&&matches[1]){type='video/'+matches[1];}}
if(type&&source.codecs){type+='; codecs="'+source.codecs+'"';}
return type;};var getQualities=function(sources,video){var qualities={};var qualityIndex=1;var lastQuality;for(var i=0;i<sources.length;i++){var source=sources[i];var type=source.type=getType(source);var isPlayable=type&&(type==='video/unknown'||video.canPlayType(type)!=='');if(!isPlayable){continue;}
if(source.quality===undefined){if(lastQuality===undefined||qualities[lastQuality].source.type===type){source.quality={name:'q'+qualityIndex,label:(source.metadata&&source.metadata.qualityName)?source.metadata.qualityName:'Quality '+qualityIndex};qualityIndex++;}
else{source.quality=qualities[lastQuality].source.quality;}}
lastQuality=source.quality.name;var quality=qualities[lastQuality];if(quality){if(source.mime.split('/')[1]===PREFERRED_FORMAT){quality.source=source;}}
else{qualities[source.quality.name]={label:source.quality.label,source:source};}}
return qualities;};var setPreferredQuality=function(quality){try{localStorage.setItem('h5pVideoQuality',quality);}
catch(err){console.warn('Unable to set preferred video quality, localStorage is not available.');}};var getPreferredQuality=function(){let quality;try{quality=localStorage.getItem('h5pVideoQuality');}
catch(err){console.warn('Unable to retrieve preferred video quality from localStorage.');}
if(!quality){try{var settings=document.cookie.split(';');for(var i=0;i<settings.length;i++){var setting=settings[i].split('=');if(setting[0]==='H5PVideoQuality'){quality=setting[1];break;}}}
catch(err){console.warn('Unable to retrieve preferred video quality from cookie.');}}
return quality;};var nextTick=function(task){setTimeout(task,0);};var OLD_ANDROID_FIX=false;var PREFERRED_FORMAT='mp4';var PLAYBACK_RATES=[0.25,0.5,1,1.25,1.5,2];if(navigator.userAgent.indexOf('Android')!==-1){var version=navigator.userAgent.match(/AppleWebKit\/(\d+\.?\d*)/);if(version&&version[1]&&Number(version[1])<=534.30){OLD_ANDROID_FIX=true;}}
else{if(navigator.userAgent.indexOf('Chrome')!==-1){PREFERRED_FORMAT='webm';}}
return Html5;})(H5P.jQuery);H5P.videoHandlers=H5P.videoHandlers||[];H5P.videoHandlers.push(H5P.VideoHtml5);