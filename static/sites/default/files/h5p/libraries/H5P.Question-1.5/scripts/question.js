H5P.Question=(function($,EventDispatcher,JoubelUI){function Question(type){var self=this;EventDispatcher.call(self);self.order=['video','image','audio','introduction','content','explanation','feedback','scorebar','buttons','read'];var sections={};var buttons={};var buttonOrder=[];var $wrapper;var clickElement;var scoreBar;var showFeedback;var buttonsToHide=[];var buttonsToShow=[];var toggleButtonsTimer;var toggleButtonsTransitionTimer;var buttonTruncationTimer;var initialized=false;var behaviour={disableFeedback:false,disableReadSpeaker:false};var imageThumb=true;var imageTransitionTimer;var sectionsIsTransitioning=false;var disableAutoPlay=false;var feedbackTransitionTimer;var $read,readText;var register=function(section,content){sections[section]={};var $e=sections[section].$element=$('<div/>',{'class':'h5p-question-'+section,});if(content){$e[content instanceof $?'append':'html'](content);}};var update=function(section,content){if(content instanceof $){sections[section].$element.html('').append(content);}
else{sections[section].$element.html(content);}};var insert=function(order,id,elements,$container){for(var i=0;i<order.length;i++){if(order[i]===id){while(i>0&&(elements[order[i-1]]===undefined||!elements[order[i-1]].isVisible)){i--;}
if(i===0){elements[id].$element.prependTo($container);}
else{elements[id].$element.insertAfter(elements[order[i-1]].$element);}
elements[id].isVisible=true;break;}}};var makeFeedbackPopup=function(closeText){var $element=sections.feedback.$element;var $parent=sections.content.$element;var $click=(clickElement!=null?clickElement.$element:null);$element.appendTo($parent).addClass('h5p-question-popup');if(sections.scorebar){sections.scorebar.$element.appendTo($element);}
$parent.addClass('h5p-has-question-popup');var $tail=$('<div/>',{'class':'h5p-question-feedback-tail'}).hide().appendTo($parent);var $close=$('<div/>',{'class':'h5p-question-feedback-close','tabindex':0,'title':closeText,on:{click:function(event){$element.remove();$tail.remove();event.preventDefault();},keydown:function(event){switch(event.which){case 13:case 32:$element.remove();$tail.remove();event.preventDefault();}}}}).hide().appendTo($element);if($click!=null){if($click.hasClass('correct')){$element.addClass('h5p-question-feedback-correct');$close.show();sections.buttons.$element.hide();}
else{sections.buttons.$element.appendTo(sections.feedback.$element);}}
positionFeedbackPopup($element,$click);};var positionFeedbackPopup=function($element,$click){var $container=$element.parent();var $tail=$element.siblings('.h5p-question-feedback-tail');var popupWidth=$element.outerWidth();var popupHeight=setElementHeight($element);var space=15;var disableTail=false;var positionY=$container.height()/2-popupHeight/2;var positionX=$container.width()/2-popupWidth/2;var tailX=0;var tailY=0;var tailRotation=0;if($click!=null){var clickNearTop=($click[0].offsetTop<space);var clickNearBottom=($click[0].offsetTop+$click.height()>$container.height()-space);var clickNearLeft=($click[0].offsetLeft<space);var clickNearRight=($click[0].offsetLeft+$click.width()>$container.width()-space);positionX=$click[0].offsetLeft-popupWidth/2+$click.width()/2;positionY=$click[0].offsetTop-popupHeight-space;tailX=positionX+popupWidth/2-$tail.width()/2;tailY=positionY+popupHeight-($tail.height()/2);tailRotation=225;if(popupHeight+space>$click[0].offsetTop){positionY=$click[0].offsetTop+$click.height()+space;tailY=positionY-$tail.height()/2;tailRotation=45;}
if(positionX<0){positionX=0;}
if(positionX+popupWidth>$container.width()){positionX=$container.width()-popupWidth;}
if(clickNearTop&&(clickNearLeft||clickNearRight)){positionX=$click[0].offsetLeft+(clickNearLeft?$click.width():-popupWidth);positionY=$click[0].offsetTop+$click.height();disableTail=true;}
else if(clickNearBottom&&(clickNearLeft||clickNearRight)){positionX=$click[0].offsetLeft+(clickNearLeft?$click.width():-popupWidth);positionY=$click[0].offsetTop-popupHeight;disableTail=true;}
else if(!clickNearTop&&!clickNearBottom){if(clickNearLeft||clickNearRight){positionY=$click[0].offsetTop-popupHeight/2+$click.width()/2;positionX=$click[0].offsetLeft+(clickNearLeft?$click.width()+space:-popupWidth+-space);if(positionX<0){positionX=0;disableTail=true;}
else{tailX=positionX+(clickNearLeft?-$tail.width()/2:popupWidth-$tail.width()/2);tailY=positionY+popupHeight/2-$tail.height()/2;tailRotation=(clickNearLeft?315:135);}}}
if(positionY+popupHeight>$container.height()){positionY=$container.height()-popupHeight;if(popupHeight>$container.height()-($click[0].offsetTop+$click.height()+space)){disableTail=true;}}}
else{disableTail=true;}
if(positionY<0){positionY=0;}
$element.css({top:positionY,left:positionX});$tail.css({top:tailY,left:tailX});if(!disableTail){$tail.css({'left':tailX,'top':tailY,'transform':'rotate('+tailRotation+'deg)'}).show();}
else{$tail.hide();}};var setElementHeight=function($element){if(!$element.is(':visible')){$element.css('max-height','none');return;}
var isFeedbackPopup=$element.hasClass('h5p-question-popup');var $tmp=$element.clone().css({'position':'absolute','max-height':'none','width':isFeedbackPopup?'':'100%'}).appendTo($element.parent());var sideMargins=parseFloat($element.css('margin-left'))
+parseFloat($element.css('margin-right'));var tmpElWidth=$tmp.css('width')?$tmp.css('width'):'100%';$tmp.css('width','calc('+tmpElWidth+' - '+sideMargins+'px)');var h=Math.round($tmp.get(0).getBoundingClientRect().height);var fontSize=parseFloat($element.css('fontSize'));var relativeH=h/fontSize;$element.css('max-height',relativeH+'em');$tmp.remove();if(h>0&&sections.buttons&&sections.buttons.$element===$element){showSection(sections.buttons);setTimeout(resizeButtons,150);}
return h;};var hideButtons=function(relocateFocus){for(var i=0;i<buttonsToHide.length;i++){hideButton(buttonsToHide[i].id);}
buttonsToHide=[];if(relocateFocus){self.focusButton();}};var hideButton=function(buttonId){buttons[buttonId].$element.detach();buttons[buttonId].isVisible=false;};var toggleButtons=function(){if(sections.buttons===undefined){return;}
clearTimeout(toggleButtonsTransitionTimer);for(var i=0;i<buttonsToShow.length;i++){insert(buttonOrder,buttonsToShow[i].id,buttons,sections.buttons.$element);buttons[buttonsToShow[i].id].isVisible=true;}
buttonsToShow=[];var numToHide=0;var relocateFocus=false;for(var j=0;j<buttonsToHide.length;j++){var button=buttons[buttonsToHide[j].id];if(button.isVisible){numToHide+=1;}
if(button.$element.is(':focus')){relocateFocus=true;}}
var animationTimer=150;if(sections.feedback&&sections.feedback.$element.hasClass('h5p-question-popup')){animationTimer=0;}
if(numToHide===sections.buttons.$element.children().length){hideSection(sections.buttons);hideButtons(relocateFocus);}
else{hideButtons(relocateFocus);if(!sections.buttons.$element.is(':empty')){showSection(sections.buttons);setElementHeight(sections.buttons.$element);toggleButtonsTransitionTimer=setTimeout(function(){self.trigger('resize');},animationTimer);}
resizeButtons();}
toggleButtonsTimer=undefined;};var scaleImage=function(){var $imgSection=sections.image.$element;clearTimeout(imageTransitionTimer);$imgSection.addClass('animatable');if(imageThumb){$(this).attr('aria-expanded',true);$imgSection.addClass('h5p-question-image-fill-width');imageThumb=false;imageTransitionTimer=setTimeout(function(){self.trigger('resize');},600);}
else{$(this).attr('aria-expanded',false);$imgSection.removeClass('h5p-question-image-fill-width');imageThumb=true;imageTransitionTimer=setTimeout(function(){self.trigger('resize');},600);}};var findScrollableAncestor=function($element,currDepth,maxDepth){if(!currDepth){currDepth=0;}
if(!maxDepth){maxDepth=5;}
if(!$element||!($element instanceof $)||document===$element.get(0)||currDepth>=maxDepth){return;}
if($element.css('overflow-y')==='auto'){return $element;}
else{return findScrollableAncestor($element.parent(),currDepth+1,maxDepth);}};var scrollToBottom=function(){if(!$wrapper||($wrapper.hasClass('h5p-standalone')&&!H5P.isFullscreen)){return;}
var scrollableAncestor=findScrollableAncestor($wrapper);if(scrollableAncestor){scrollableAncestor.animate({scrollTop:$wrapper.css('height')},"slow");}};var resizeButtons=function(){if(!buttons||!sections.buttons){return;}
var go=function(){if(!sections.buttons.$element.is(':visible')){return;}
var buttonsWidth={max:0,min:0,current:0};for(var i in buttons){var button=buttons[i];if(button.isVisible){setButtonWidth(buttons[i]);buttonsWidth.max+=button.width.max;buttonsWidth.min+=button.width.min;buttonsWidth.current+=button.isTruncated?button.width.min:button.width.max;}}
var makeButtonsFit=function(availableWidth){if(buttonsWidth.max<availableWidth){if(buttonsWidth.max!==buttonsWidth.current){restoreButtonLabels(buttonsWidth.current,availableWidth);}
return true;}
else if(buttonsWidth.min<availableWidth){if(buttonsWidth.current>availableWidth){removeButtonLabels(buttonsWidth.current,availableWidth);}
else{restoreButtonLabels(buttonsWidth.current,availableWidth);}
return true;}
return false;};toggleFullWidthScorebar(false);var buttonSectionWidth=Math.floor(sections.buttons.$element.width())-1;if(!makeButtonsFit(buttonSectionWidth)){toggleFullWidthScorebar(true);buttonSectionWidth=Math.floor(sections.buttons.$element.width())-1;makeButtonsFit(buttonSectionWidth);}};if(sections.buttons.$element.is(':visible')){go();}
else{if(buttonTruncationTimer){clearTimeout(buttonTruncationTimer);}
buttonTruncationTimer=setTimeout(function(){buttonTruncationTimer=undefined;go();},0);}};var toggleFullWidthScorebar=function(enabled){if(sections.scorebar&&sections.scorebar.$element&&sections.scorebar.$element.hasClass('h5p-question-visible')){sections.buttons.$element.addClass('has-scorebar');sections.buttons.$element.toggleClass('wrap',enabled);sections.scorebar.$element.toggleClass('full-width',enabled);}
else{sections.buttons.$element.removeClass('has-scorebar');}};var removeButtonLabels=function(buttonsWidth,maxButtonsWidth){for(var i=buttonOrder.length-1;i>=0;i--){var buttonId=buttonOrder[i];var button=buttons[buttonId];if(!button.isTruncated&&button.isVisible){var $button=button.$element;buttonsWidth-=button.width.max-button.width.min;button.$element.attr('aria-label',$button.text()).html('').addClass('truncated');button.isTruncated=true;if(buttonsWidth<=maxButtonsWidth){return;}}}};var restoreButtonLabels=function(buttonsWidth,maxButtonsWidth){for(var i=0;i<buttonOrder.length;i++){var buttonId=buttonOrder[i];var button=buttons[buttonId];if(button.isTruncated&&button.isVisible){buttonsWidth+=button.width.max-button.width.min+1;if(buttonsWidth>maxButtonsWidth){return;}
button.$element.html(button.text);button.$element.removeClass('truncated');button.isTruncated=false;}}};var existsInArray=function(keyValue,key,array){var i;for(i=0;i<array.length;i++){if(array[i][key]===keyValue){return i;}}
return-1;};var showSection=function(section){section.$element.addClass('h5p-question-visible');section.isVisible=true;};var hideSection=function(section){section.$element.css('max-height','');section.isVisible=false;setTimeout(function(){if(!section.isVisible){section.$element.removeClass('h5p-question-visible');}},150);};self.setBehaviour=function(options){$.extend(behaviour,options);};self.setVideo=function(params){sections.video={$element:$('<div/>',{'class':'h5p-question-video'})};if(disableAutoPlay&&params.params.playback){params.params.playback.autoplay=false;}
if(!params.params.visuals){params.params.visuals={};}
params.params.visuals.fit=false;sections.video.instance=H5P.newRunnable(params,self.contentId,sections.video.$element,true);var fromVideo=false;sections.video.instance.on('resize',function(){fromVideo=true;self.trigger('resize');fromVideo=false;});self.on('resize',function(){if(!fromVideo){sections.video.instance.trigger('resize');}});return self;};self.setAudio=function(params){params.params=params.params||{};sections.audio={$element:$('<div/>',{'class':'h5p-question-audio',})};if(disableAutoPlay){params.params.autoplay=false;}
else if(params.params.playerMode==='transparent'){params.params.autoplay=true;}
sections.audio.instance=H5P.newRunnable(params,self.contentId,sections.audio.$element,true);if(sections.audio.instance.audio){sections.audio.instance.audio.style.height='';}
return self;};self.pause=function(){if(sections.video&&sections.video.isVisible){sections.video.instance.pause();}
if(sections.audio&&sections.audio.isVisible){sections.audio.instance.pause();}};self.play=function(){if(sections.video&&sections.video.isVisible){sections.video.instance.play();}
if(sections.audio&&sections.audio.isVisible){sections.audio.instance.play();}};self.disableAutoPlay=function(){disableAutoPlay=true;};self.setImage=function(path,options){options=options?options:{};sections.image={};sections.image.$element=$('<div/>',{'class':'h5p-question-image h5p-question-image-fill-width'});var $imgWrap=$('<div/>',{'class':'h5p-question-image-wrap',appendTo:sections.image.$element});var $img=$('<img/>',{src:H5P.getPath(path,self.contentId),alt:(options.alt===undefined?'':options.alt),title:(options.title===undefined?'':options.title),on:{load:function(){self.trigger('imageLoaded',this);self.trigger('resize');}},appendTo:$imgWrap});if(options.disableImageZooming){$img.css('maxHeight','none');var determineImgWidth=function(){var imageSectionWidth=sections.image.$element.get(0).getBoundingClientRect().width;$imgWrap.css({'-webkit-transition':'none','transition':'none'});var diffX=2*($imgWrap.get(0).getBoundingClientRect().left-
sections.image.$element.get(0).getBoundingClientRect().left);if($img.get(0).naturalWidth>=imageSectionWidth-diffX){sections.image.$element.addClass('h5p-question-image-fill-width');}
else{sections.image.$element.removeClass('h5p-question-image-fill-width');}
$imgWrap.css({'-webkit-transition':'','transition':''});};if($img.is(':visible')){determineImgWidth();}
else{$img.on('load',determineImgWidth);}
return;}
var sizeDetermined=false;var determineSize=function(){if(sizeDetermined||!$img.is(':visible')){return;}
$imgWrap.addClass('h5p-question-image-scalable').attr('aria-expanded',false).attr('role','button').attr('tabIndex','0').on('click',function(event){if(event.which===1){scaleImage.apply(this);}}).on('keypress',function(event){if(event.which===32){event.preventDefault();scaleImage.apply(this);}});sections.image.$element.removeClass('h5p-question-image-fill-width');sizeDetermined=true;};self.on('resize',determineSize);return self;};self.setIntroduction=function(content){register('introduction',content);return self;};self.setContent=function(content,options){register('content',content);if(options&&options.class){sections.content.$element.addClass(options.class);}
return self;};self.read=function(content){if(!$read){return;}
if(readText){readText+=(readText.substr(-1,1)==='.'?' ':'. ')+content;}
else{readText=content;}
$read.html(readText);setTimeout(function(){readText=null;$read.html('');},100);};self.readFeedback=function(){var invalidFeedback=behaviour.disableReadSpeaker||!showFeedback||!sections.feedback||!sections.feedback.$element;if(invalidFeedback){return;}
var $feedbackText=$('.h5p-question-feedback-content-text',sections.feedback.$element);if($feedbackText&&$feedbackText.html()&&$feedbackText.html().length){self.read($feedbackText.html());}};self.removeFeedback=function(){clearTimeout(feedbackTransitionTimer);if(sections.feedback&&showFeedback){showFeedback=false;hideSection(sections.scorebar);hideSection(sections.feedback);sectionsIsTransitioning=true;feedbackTransitionTimer=setTimeout(function(){if(!showFeedback){sections.feedback.$element.children().detach();sections.scorebar.$element.children().detach();self.trigger('resize');}
sectionsIsTransitioning=false;scoreBar.setScore(0);},150);if($wrapper){$wrapper.find('.h5p-question-feedback-tail').remove();}}
return self;};self.setFeedback=function(content,score,maxScore,scoreBarLabel,helpText,popupSettings,scoreExplanationButtonLabel){if(behaviour.disableFeedback){return self;}
toggleButtons();clickElement=(popupSettings!=null&&popupSettings.click!=null?popupSettings.click:null);clearTimeout(feedbackTransitionTimer);var $feedback=$('<div>',{'class':'h5p-question-feedback-container'});var $feedbackContent=$('<div>',{'class':'h5p-question-feedback-content'}).appendTo($feedback);$('<div>',{'class':'h5p-question-feedback-content-text','html':content}).appendTo($feedbackContent);var $scorebar=$('<div>',{'class':'h5p-question-scorebar-container'});if(scoreBar===undefined){scoreBar=JoubelUI.createScoreBar(maxScore,scoreBarLabel,helpText,scoreExplanationButtonLabel);}
scoreBar.appendTo($scorebar);$feedbackContent.toggleClass('has-content',content!==undefined&&content.length>0);if(!behaviour.disableReadSpeaker&&scoreBarLabel){self.read(scoreBarLabel.replace(':num',score).replace(':total',maxScore)+'. '+(content?content:''));}
showFeedback=true;if(sections.feedback){update('feedback',$feedback);update('scorebar',$scorebar);}
else{register('feedback',$feedback);register('scorebar',$scorebar);if(initialized&&$wrapper){insert(self.order,'feedback',sections,$wrapper);insert(self.order,'scorebar',sections,$wrapper);}}
showSection(sections.feedback);showSection(sections.scorebar);resizeButtons();if(popupSettings!=null&&popupSettings.showAsPopup==true){makeFeedbackPopup(popupSettings.closeText);scoreBar.setScore(score);}
else{feedbackTransitionTimer=setTimeout(function(){setElementHeight(sections.feedback.$element);setElementHeight(sections.scorebar.$element);sectionsIsTransitioning=true;scrollToBottom();feedbackTransitionTimer=setTimeout(function(){sectionsIsTransitioning=false;self.trigger('resize');scoreBar.setScore(score);},150);},0);}
return self;};self.updateFeedbackContent=function(content,extendContent){if(sections.feedback&&sections.feedback.$element){if(extendContent){content=$('.h5p-question-feedback-content',sections.feedback.$element).html()+' '+content;}
$('.h5p-question-feedback-content',sections.feedback.$element).html(content).addClass('has-content');setElementHeight(sections.feedback.$element);setTimeout(self.trigger.bind(self,'resize'),150);}
return self;};self.setExplanation=function(data,title){if(data){var explainer=new H5P.Question.Explainer(title,data);if(sections.explanation){update('explanation',explainer.getElement());}
else{register('explanation',explainer.getElement());if(initialized&&$wrapper){insert(self.order,'explanation',sections,$wrapper);}}}
else if(sections.explanation){sections.explanation.$element.children().detach();}
return self;};self.hasButton=function(id){return(buttons[id]!==undefined);};self.addButton=function(id,text,clicked,visible,options,extras){if(buttons[id]){return self;}
if(sections.buttons===undefined){register('buttons');if(initialized){insert(self.order,'buttons',sections,$wrapper);}}
extras=extras||{};extras.confirmationDialog=extras.confirmationDialog||{};options=options||{};var confirmationDialog=self.addConfirmationDialogToButton(extras.confirmationDialog,clicked);var handleButtonClick=function(){if(extras.confirmationDialog.enable&&confirmationDialog){if(!extras.confirmationDialog.$parentElement){sections.popups.$element.removeClass('hidden');}
confirmationDialog.show($e.position().top);}
else{clicked();}};const isSubmitting=extras.contentData&&extras.contentData.standalone&&(extras.contentData.isScoringEnabled||extras.contentData.isReportingEnabled);if(isSubmitting&&extras.textIfSubmitting){text=extras.textIfSubmitting;}
buttons[id]={isTruncated:false,text:text,isVisible:false};var isAnchorTag=(options.href!==undefined);var $e=buttons[id].$element=JoubelUI.createButton($.extend({'class':'h5p-question-'+id,html:text,title:text,on:{click:function(event){handleButtonClick();if(isAnchorTag){event.preventDefault();}}}},options));buttonOrder.push(id);if(isAnchorTag){$e.on('keypress',function(event){if(event.which===32){handleButtonClick();event.preventDefault();}});}
if(visible===undefined||visible){$e.appendTo(sections.buttons.$element);buttons[id].isVisible=true;showSection(sections.buttons);}
return self;};var setButtonWidth=function(button){var $button=button.$element;var $tmp=$button.clone().css({'position':'absolute','white-space':'nowrap','max-width':'none'}).removeClass('truncated').html(button.text).appendTo($button.parent());button.width={max:Math.ceil($tmp.outerWidth()+parseFloat($tmp.css('margin-left'))+parseFloat($tmp.css('margin-right')))};$tmp.html('').addClass('truncated');button.width.min=Math.ceil($tmp.outerWidth()+parseFloat($tmp.css('margin-left'))+parseFloat($tmp.css('margin-right')));$tmp.remove();};self.addConfirmationDialogToButton=function(options,clicked){options=options||{};if(!options.enable){return;}
var confirmationDialog=new H5P.ConfirmationDialog({instance:options.instance,headerText:options.l10n.header,dialogText:options.l10n.body,cancelText:options.l10n.cancelLabel,confirmText:options.l10n.confirmLabel});if(options.$parentElement){confirmationDialog.appendTo(options.$parentElement.get(0));}
else{if(sections.popups===undefined){register('popups');if(initialized){insert(self.order,'popups',sections,$wrapper);}
sections.popups.$element.addClass('hidden');self.order.push('popups');}
confirmationDialog.appendTo(sections.popups.$element.get(0));}
confirmationDialog.on('confirmed',function(){if(!options.$parentElement){sections.popups.$element.addClass('hidden');}
clicked();self.trigger('confirmed');});confirmationDialog.on('canceled',function(){if(!options.$parentElement){sections.popups.$element.addClass('hidden');}
self.trigger('canceled');});return confirmationDialog;};self.showButton=function(id,priority){var aboutToBeHidden=existsInArray(id,'id',buttonsToHide)!==-1;if(buttons[id]===undefined||(buttons[id].isVisible===true&&!aboutToBeHidden)){return self;}
priority=priority||0;var indexToShow=existsInArray(id,'id',buttonsToShow);if(indexToShow!==-1){if(buttonsToShow[indexToShow].priority<priority){buttonsToShow[indexToShow].priority=priority;}
return self;}
var exists=existsInArray(id,'id',buttonsToHide);if(exists!==-1){if(buttonsToHide[exists].priority<=priority){buttonsToHide.splice(exists,1);buttonsToShow.push({id:id,priority:priority});}}
else if(!buttons[id].$element.is(':visible')){buttonsToShow.push({id:id,priority:priority});}
if(!toggleButtonsTimer){toggleButtonsTimer=setTimeout(toggleButtons,0);}
return self;};self.hideButton=function(id,priority){var aboutToBeShown=existsInArray(id,'id',buttonsToShow)!==-1;if(buttons[id]===undefined||(buttons[id].isVisible===false&&!aboutToBeShown)){return self;}
priority=priority||0;var indexToHide=existsInArray(id,'id',buttonsToHide);if(indexToHide!==-1){if(buttonsToHide[indexToHide].priority<priority){buttonsToHide[indexToHide].priority=priority;}
return self;}
var exists=existsInArray(id,'id',buttonsToShow);if(exists!==-1){if(buttonsToShow[exists].priority<=priority){buttonsToShow.splice(exists,1);buttonsToHide.push({id:id,priority:priority});}}
else if(!buttons[id].$element.is(':visible')){hideButton(id);}
else{buttonsToHide.push({id:id,priority:priority});}
if(!toggleButtonsTimer){toggleButtonsTimer=setTimeout(toggleButtons,0);}
return self;};self.focusButton=function(id){if(id===undefined){for(var i=0;i<buttonOrder.length;i++){var button=buttons[buttonOrder[i]];if(button&&button.isVisible){button.$element.focus();break;}}}
else if(buttons[id]&&buttons[id].$element.is(':visible')){buttons[id].$element.focus();}
return self;};self.toggleReadSpeaker=function(disable){behaviour.disableReadSpeaker=disable||!behaviour.disableReadSpeaker;};self.insertSectionAtElement=function(id,$element){if(sections[id]===undefined){register(id);}
sections[id].parent=$element;if(!initialized){insert([id],id,sections,$element);}
return self;};self.attach=function($container){if(self.isRoot()){self.setActivityStarted();}
if($wrapper===undefined){if(self.registerDomElements!==undefined&&(self.registerDomElements instanceof Function||typeof self.registerDomElements==='function')){self.registerDomElements();}
$read=$('<div/>',{'aria-live':'polite','class':'h5p-hidden-read'});register('read',$read);self.trigger('registerDomElements');}
$wrapper=$container;$container.html('').addClass('h5p-question h5p-'+type);var $sections=[];for(var i=0;i<self.order.length;i++){var section=self.order[i];if(sections[section]){if(sections[section].parent){sections[section].$element.appendTo(sections[section].parent);}
else{$sections.push(sections[section].$element);}
sections[section].isVisible=true;}}
$container.append($sections);self.trigger('domChanged',{'$target':$container,'library':self.libraryInfo.machineName,'contentId':self.contentId,'key':'newLibrary'},{'bubbles':true,'external':true});initialized=true;return self;};self.detachSections=function(){initialized=false;for(var section in sections){sections[section].$element.detach();}
return self;};self.on('resize',function(){if(!sectionsIsTransitioning&&sections.feedback&&showFeedback){setElementHeight(sections.feedback.$element);}
var $element=sections.feedback;var $click=clickElement;if($element!=null&&$element.$element!=null&&$click!=null&&$click.$element!=null){setTimeout(function(){positionFeedbackPopup($element.$element,$click.$element);},10);}
resizeButtons();});}
Question.prototype=Object.create(EventDispatcher.prototype);Question.prototype.constructor=Question;Question.determineOverallFeedback=function(feedbacks,scoreRatio){scoreRatio=Math.floor(scoreRatio*100);for(var i=0;i<feedbacks.length;i++){var feedback=feedbacks[i];var hasFeedback=(feedback.feedback!==undefined&&feedback.feedback.trim().length!==0);if(feedback.from<=scoreRatio&&feedback.to>=scoreRatio&&hasFeedback){return feedback.feedback;}}
return '';};return Question;})(H5P.jQuery,H5P.EventDispatcher,H5P.JoubelUI);