H5P.JoubelTip=(function($){var $conv=$('<div/>');function JoubelTip(tipHtml,behaviour){var speechBubble;var tipText=$conv.html(tipHtml).text().trim();if(tipText===''){return;}
behaviour=$.extend({tipLabel:tipText,helpIcon:false,showSpeechBubble:true,tabcontrol:false},behaviour);var $tipButton=$('<div/>',{class:'joubel-tip-container'+(behaviour.showSpeechBubble?'':' be-quiet'),'aria-label':behaviour.tipLabel,'aria-expanded':false,role:'button',tabindex:(behaviour.tabcontrol?-1:0),click:function(event){toggleSpeechBubble();event.preventDefault();},keydown:function(event){if(event.which===32||event.which===13){toggleSpeechBubble();event.stopPropagation();event.preventDefault();}
else{toggleSpeechBubble(false);}},html:'<span class="joubel-icon-tip-normal '+(behaviour.helpIcon?' help-icon':'')+'">'+
'<span class="h5p-icon-shadow"></span>'+
'<span class="h5p-icon-speech-bubble"></span>'+
'<span class="h5p-icon-info"></span>'+
'</span>'});const $tipAnnouncer=$('<div>',{'class':'hidden-but-read','aria-live':'polite',appendTo:$tipButton,});var toggleSpeechBubble=function(force){if(speechBubble!==undefined&&speechBubble.isCurrent($tipButton)){speechBubble.remove();speechBubble=undefined;$tipButton.attr('aria-expanded',false);$tipAnnouncer.html('');}
else if(force!==false&&behaviour.showSpeechBubble){speechBubble=H5P.JoubelSpeechBubble($tipButton,tipHtml);$tipButton.attr('aria-expanded',true);$tipAnnouncer.html(tipHtml);}};return $tipButton;}
return JoubelTip;})(H5P.jQuery);