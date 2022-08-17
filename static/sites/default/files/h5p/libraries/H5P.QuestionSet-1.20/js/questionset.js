H5P=H5P||{};H5P.QuestionSet=function(options,contentId,contentData){if(!(this instanceof H5P.QuestionSet)){return new H5P.QuestionSet(options,contentId,contentData);}
H5P.EventDispatcher.call(this);var $=H5P.jQuery;var self=this;this.contentId=contentId;var defaults={initialQuestion:0,progressType:'dots',passPercentage:50,questions:[],introPage:{showIntroPage:false,title:'',introduction:'',startButtonText:'Start'},texts:{prevButton:'Previous question',nextButton:'Next question',finishButton:'Finish',submitButton:'Submit',textualProgress:'Question: @current of @total questions',jumpToQuestion:'Question %d of %total',questionLabel:'Question',readSpeakerProgress:'Question @current of @total',unansweredText:'Unanswered',answeredText:'Answered',currentQuestionText:'Current question',navigationLabel:'Questions'},endGame:{showResultPage:true,noResultMessage:'Finished',message:'Your result:',scoreBarLabel:'You got @finals out of @totals points',oldFeedback:{successGreeting:'',successComment:'',failGreeting:'',failComment:''},overallFeedback:[],finishButtonText:'Finish',submitButtonText:'Submit',solutionButtonText:'Show solution',retryButtonText:'Retry',showAnimations:false,skipButtonText:'Skip video',showSolutionButton:true,showRetryButton:true},override:{},disableBackwardsNavigation:false};this.isSubmitting=contentData&&(contentData.isScoringEnabled||contentData.isReportingEnabled);var params=$.extend(true,{},defaults,options);var texttemplate='<% if (introPage.showIntroPage && noOfQuestionAnswered === 0) { %>'+
'<div class="intro-page">'+
'  <% if (introPage.title) { %>'+
'    <div class="title"><h1><%= introPage.title %></h1></div>'+
'  <% } %>'+
'  <% if (introPage.introduction) { %>'+
'    <div class="introduction"><%= introPage.introduction %></div>'+
'  <% } %>'+
'  <div class="buttons"><button class="qs-startbutton h5p-joubelui-button h5p-button"><%= introPage.startButtonText %></button></div>'+
'</div>'+
'<% } %>'+
'<div tabindex="-1" class="qs-progress-announcer"></div>'+
'<div class="questionset<% if (introPage.showIntroPage && noOfQuestionAnswered === 0) { %> hidden<% } %>">'+
'  <% for (var i=0; i<questions.length; i++) { %>'+
'    <div class="question-container"></div>'+
'  <% } %>'+
'  <div class="qs-footer">'+
'    <div class="qs-progress" role="navigation" aria-label="<%= texts.navigationLabel %>">'+
'      <% if (progressType == "dots") { %>'+
'        <ul class="dots-container">'+
'          <% for (var i=0; i<questions.length; i++) { %>'+
'           <li class="progress-item">'+
'             <a href="#" '+
'               class="progress-dot unanswered<%'+
'               if (disableBackwardsNavigation) { %> disabled <% } %>"'+
'               aria-label="<%='+
'               texts.jumpToQuestion.replace("%d", i + 1).replace("%total", questions.length)'+
'               + ", " + texts.unansweredText %>" tabindex="-1" '+
'               <% if (disableBackwardsNavigation) { %> aria-disabled="true" <% } %>'+
'             ></a>'+
'           </li>'+
'          <% } %>'+
'        </div>'+
'      <% } else if (progressType == "textual") { %>'+
'        <span class="progress-text"></span>'+
'      <% } %>'+
'    </div>'+
'  </div>'+
'</div>';var solutionButtonTemplate=params.endGame.showSolutionButton?'    <button type="button" class="h5p-joubelui-button h5p-button qs-solutionbutton"><%= solutionButtonText %></button>':'';const retryButtonTemplate=params.endGame.showRetryButton?'    <button type="button" class="h5p-joubelui-button h5p-button qs-retrybutton"><%= retryButtonText %></button>':'';var resulttemplate='<div class="questionset-results">'+
'  <div class="greeting"><%= message %></div>'+
'  <div class="feedback-section">'+
'    <div class="feedback-scorebar"></div>'+
'    <div class="feedback-text"></div>'+
'  </div>'+
'  <% if (comment) { %>'+
'  <div class="result-header"><%= comment %></div>'+
'  <% } %>'+
'  <% if (resulttext) { %>'+
'  <div class="result-text"><%= resulttext %></div>'+
'  <% } %>'+
'  <div class="buttons">'+
solutionButtonTemplate+
retryButtonTemplate+
'  </div>'+
'</div>';var template=new EJS({text:texttemplate});var endTemplate=new EJS({text:resulttemplate});var initialParams=$.extend(true,{},defaults,options);var poolOrder;var currentQuestion=0;var questionInstances=[];var questionOrder;var $myDom;var scoreBar;var up;var renderSolutions=false;var showingSolutions=false;contentData=contentData||{};if(contentData.previousState){if(contentData.previousState.progress){currentQuestion=contentData.previousState.progress;}
questionOrder=contentData.previousState.order;}
var randomizeQuestionOrdering=function(questions){var questionOrdering=questions.map(function(questionInstance,index){return[questionInstance,index];});questionOrdering=H5P.shuffleArray(questionOrdering);questions=[];for(var i=0;i<questionOrdering.length;i++){questions[i]=questionOrdering[i][0];}
var newOrder=[];for(var j=0;j<questionOrdering.length;j++){if(contentData.previousState&&contentData.previousState.questionOrder){newOrder[j]=questionOrder[questionOrdering[j][1]];}
else{newOrder[j]=questionOrdering[j][1];}}
return{questions:questions,questionOrder:newOrder};};if(params.poolSize>0){if(contentData.previousState&&contentData.previousState.poolOrder){poolOrder=contentData.previousState.poolOrder;var pool=[];for(var i=0;i<poolOrder.length;i++){pool[i]=params.questions[poolOrder[i]];}
params.questions=pool;}
else{var poolResult=randomizeQuestionOrdering(params.questions);var poolQuestions=poolResult.questions;poolOrder=poolResult.questionOrder;poolQuestions=poolQuestions.slice(0,params.poolSize);poolOrder=poolOrder.slice(0,params.poolSize);params.questions=poolQuestions;}}
var override;if(params.override.showSolutionButton||params.override.retryButton||params.override.checkButton===false){override={};if(params.override.showSolutionButton){override.enableSolutionsButton=(params.override.showSolutionButton==='on'?true:false);}
if(params.override.retryButton){override.enableRetry=(params.override.retryButton==='on'?true:false);}
if(params.override.checkButton===false){override.enableCheckButton=params.override.checkButton;}}
var createQuestionInstancesFromQuestions=function(questions){var result=[];for(var i=0;i<questions.length;i++){var question;if(questionOrder!==undefined){question=questions[questionOrder[i]];}
else{question=questions[i];}
if(override){$.extend(question.params.behaviour,override);}
question.params=question.params||{};var hasAnswers=contentData.previousState&&contentData.previousState.answers;var questionInstance=H5P.newRunnable(question,contentId,undefined,undefined,{previousState:hasAnswers?contentData.previousState.answers[i]:undefined,parent:self});questionInstance.on('resize',function(){up=true;self.trigger('resize');});result.push(questionInstance);}
return result;};questionInstances=createQuestionInstancesFromQuestions(params.questions);params.noOfQuestionAnswered=0;if(contentData.previousState){if(contentData.previousState.answers){for(var i=0;i<questionInstances.length;i++){let answered=questionInstances[i].getAnswerGiven();if(answered){params.noOfQuestionAnswered++;}}}}
var $template=$(template.render(params));if(params.randomQuestions&&contentData.previousState===undefined){var result=randomizeQuestionOrdering(questionInstances);questionInstances=result.questions;questionOrder=result.questionOrder;}
self.on('resize',function(){if(up){up=false;return;}
for(var i=0;i<questionInstances.length;i++){questionInstances[i].trigger('resize');}});var _updateButtons=function(){if(params.disableBackwardsNavigation){if(questionInstances[currentQuestion].getAnswerGiven()&&questionInstances.length-1!==currentQuestion){questionInstances[currentQuestion].showButton('next');}
else{questionInstances[currentQuestion].hideButton('next');}}
var answered=true;for(var i=questionInstances.length-1;i>=0;i--){answered=answered&&(questionInstances[i]).getAnswerGiven();}
if(currentQuestion===(params.questions.length-1)&&questionInstances[currentQuestion]){if(answered){questionInstances[currentQuestion].showButton('finish');}
else{questionInstances[currentQuestion].hideButton('finish');}}};var _showQuestion=function(questionNumber,preventAnnouncement){if(questionNumber<0){questionNumber=0;}
if(questionNumber>=params.questions.length){questionNumber=params.questions.length-1;}
currentQuestion=questionNumber;$('.question-container',$myDom).hide().eq(questionNumber).show();if(questionInstances[questionNumber]){var instance=questionInstances[questionNumber];instance.setActivityStarted();if(instance.$!==undefined){instance.trigger('resize');}}
if(params.progressType==='textual'){$('.progress-text',$myDom).text(params.texts.textualProgress.replace("@current",questionNumber+1).replace("@total",params.questions.length));}
else{var previousQuestion=$('.progress-dot.current',$myDom).parent().index();if(previousQuestion>=0){toggleCurrentDot(previousQuestion,false);toggleAnsweredDot(previousQuestion,questionInstances[previousQuestion].getAnswerGiven());}
toggleCurrentDot(questionNumber,true);}
if(!preventAnnouncement){setTimeout(function(){var humanizedProgress=params.texts.readSpeakerProgress.replace('@current',(currentQuestion+1).toString()).replace('@total',questionInstances.length.toString());$('.qs-progress-announcer',$myDom).html(humanizedProgress).show().focus();if(instance&&instance.readFeedback){instance.readFeedback();}},0);}
_updateButtons();self.trigger('resize');return currentQuestion;};var showSolutions=function(){showingSolutions=true;for(var i=0;i<questionInstances.length;i++){toggleDotsNavigation(true);if(i<questionInstances.length-1){questionInstances[i].showButton('next');}
if(i>0){questionInstances[i].showButton('prev');}
try{questionInstances[i].toggleReadSpeaker(true);questionInstances[i].showSolutions();questionInstances[i].toggleReadSpeaker(false);}
catch(error){H5P.error("subcontent does not contain a valid showSolutions function");H5P.error(error);}}};var toggleDotsNavigation=function(enable){$('.progress-dot',$myDom).each(function(){$(this).toggleClass('disabled',!enable);$(this).attr('aria-disabled',enable?'false':'true');if(!enable){$(this).attr('tabindex','-1');}});};this.resetTask=function(){contentData.previousState=[];showingSolutions=false;for(var i=0;i<questionInstances.length;i++){try{questionInstances[i].resetTask();if(params.disableBackwardsNavigation){toggleDotsNavigation(false);if(i===0&&questionInstances[i].getAnswerGiven()){questionInstances[i].showButton('next');}
else{questionInstances[i].hideButton('next');}
questionInstances[i].hideButton('prev');}}
catch(error){H5P.error("subcontent does not contain a valid resetTask function");H5P.error(error);}}
questionInstances[questionInstances.length-1].hideButton('finish');$('.progress-dot').each(function(idx){toggleAnsweredDot(idx,false);});rendered=false;if(params.poolSize>0){var poolResult=randomizeQuestionOrdering(initialParams.questions);var poolQuestions=poolResult.questions;poolOrder=poolResult.questionOrder;poolQuestions=poolQuestions.slice(0,params.poolSize);poolOrder=poolOrder.slice(0,params.poolSize);params.questions=poolQuestions;questionInstances=createQuestionInstancesFromQuestions(params.questions);initializeQuestion();}
else if(params.randomQuestions){randomizeQuestions();}};var rendered=false;this.reRender=function(){rendered=false;};var randomizeQuestions=function(){var result=randomizeQuestionOrdering(questionInstances);questionInstances=result.questions;questionOrder=result.questionOrder;replaceQuestionsInDOM(questionInstances);};var replaceQuestionsInDOM=function(questionInstances){$('.question-container',$myDom).each(function(){$(this).children().detach();});for(var i=0;i<questionInstances.length;i++){var question=questionInstances[i];$('.question-container:eq('+i+')',$myDom).attr('class','question-container');question.attach($('.question-container:eq('+i+')',$myDom));if(questionInstances[questionInstances.length-1]===question&&question.hasButton('finish')){question.showButton('finish');}
if(questionInstances[questionInstances.length-1]!==question&&question.hasButton('next')){question.showButton('next');}
if(questionInstances[0]!==question&&question.hasButton('prev')&&!params.disableBackwardsNavigation){question.showButton('prev');}
if(questionInstances[0]===question){question.hideButton('prev');}
if(questionInstances[questionInstances.length-1]===question){question.hideButton('next');}
if(questionInstances[questionInstances.length-1]!==question){question.hideButton('finish');}}};var moveQuestion=function(direction){if(params.disableBackwardsNavigation&&!questionInstances[currentQuestion].getAnswerGiven()){questionInstances[currentQuestion].hideButton('next');questionInstances[currentQuestion].hideButton('finish');return;}
if(currentQuestion+direction>=questionInstances.length){_displayEndGame();}
else{_showQuestion(currentQuestion+direction);}};var toggleAnsweredDot=function(dotIndex,isAnswered){var $el=$('.progress-dot:eq('+dotIndex+')',$myDom);if($el.hasClass('current')){return;}
isAnswered=!!isAnswered;var label=params.texts.jumpToQuestion.replace('%d',(dotIndex+1).toString()).replace('%total',$('.progress-dot',$myDom).length)+
', '+
(isAnswered?params.texts.answeredText:params.texts.unansweredText);$el.toggleClass('unanswered',!isAnswered).toggleClass('answered',isAnswered).attr('aria-label',label);};var toggleCurrentDot=function(dotIndex,isCurrent){var $el=$('.progress-dot:eq('+dotIndex+')',$myDom);var texts=params.texts;var label=texts.jumpToQuestion.replace('%d',(dotIndex+1).toString()).replace('%total',$('.progress-dot',$myDom).length);if(!isCurrent){var isAnswered=$el.hasClass('answered');label+=', '+(isAnswered?texts.answeredText:texts.unansweredText);}
else{label+=', '+texts.currentQuestionText;}
var disabledTabindex=params.disableBackwardsNavigation&&!showingSolutions;$el.toggleClass('current',isCurrent).attr('aria-label',label).attr('tabindex',isCurrent&&!disabledTabindex?0:-1);};var _displayEndGame=function(){$('.progress-dot.current',$myDom).removeClass('current');if(rendered){$myDom.children().hide().filter('.questionset-results').show();self.trigger('resize');return;}
$myDom.children().hide().filter('.questionset-results').remove();rendered=true;var finals=self.getScore();var totals=self.getMaxScore();var scoreString=H5P.Question.determineOverallFeedback(params.endGame.overallFeedback,finals/totals).replace('@score',finals).replace('@total',totals);var success=((100*finals/totals)>=params.passPercentage);var hookUpButton=function(classSelector,handler){$(classSelector,$myDom).click(handler).keypress(function(e){if(e.which===32){handler();e.preventDefault();}});};var displayResults=function(){self.triggerXAPICompleted(self.getScore(),self.getMaxScore(),success);var eparams={message:params.endGame.showResultPage?params.endGame.message:params.endGame.noResultMessage,comment:params.endGame.showResultPage?(success?params.endGame.oldFeedback.successGreeting:params.endGame.oldFeedback.failGreeting):undefined,resulttext:params.endGame.showResultPage?(success?params.endGame.oldFeedback.successComment:params.endGame.oldFeedback.failComment):undefined,finishButtonText:(self.isSubmitting)?params.endGame.submitButtonText:params.endGame.finishButtonText,solutionButtonText:params.endGame.solutionButtonText,retryButtonText:params.endGame.retryButtonText};$myDom.children().hide();$myDom.append(endTemplate.render(eparams));if(params.endGame.showResultPage){hookUpButton('.qs-solutionbutton',function(){showSolutions();$myDom.children().hide().filter('.questionset').show();_showQuestion(params.initialQuestion);});hookUpButton('.qs-retrybutton',function(){self.resetTask();$myDom.children().hide();var $intro=$('.intro-page',$myDom);if($intro.length){$('.intro-page',$myDom).show();$('.qs-startbutton',$myDom).focus();}
else{$('.questionset',$myDom).show();_showQuestion(params.initialQuestion);}});if(scoreBar===undefined){scoreBar=H5P.JoubelUI.createScoreBar(totals);}
scoreBar.appendTo($('.feedback-scorebar',$myDom));$('.feedback-text',$myDom).html(scoreString);setTimeout(function(){$('.qs-progress-announcer',$myDom).html(eparams.message+
scoreString+'.'+
(params.endGame.scoreBarLabel).replace('@finals',finals).replace('@totals',totals)+'.'+
eparams.comment+'.'+
eparams.resulttext).show().focus();scoreBar.setMaxScore(totals);scoreBar.setScore(finals);},0);}
else{$('.qs-solutionbutton, .qs-retrybutton, .feedback-section',$myDom).remove();}
self.trigger('resize');};if(params.endGame.showAnimations){var videoData=success?params.endGame.successVideo:params.endGame.failVideo;if(videoData){$myDom.children().hide();var $videoContainer=$('<div class="video-container"></div>').appendTo($myDom);var video=new H5P.Video({sources:videoData,fitToWrapper:true,controls:false,autoplay:false},contentId);video.on('stateChange',function(event){if(event.data===H5P.Video.ENDED){displayResults();$videoContainer.hide();}});video.attach($videoContainer);video.on('loaded',function(){self.trigger('resize');});video.play();if(params.endGame.skippable){$('<a class="h5p-joubelui-button h5p-button skip">'+params.endGame.skipButtonText+'</a>').click(function(){video.pause();$videoContainer.hide();displayResults();}).appendTo($videoContainer);}
return;}}
displayResults();self.trigger('resize');};var registerImageLoadedListener=function(question){H5P.on(question,'imageLoaded',function(){self.trigger('resize');});};function initializeQuestion(){for(var i=0;i<questionInstances.length;i++){var question=questionInstances[i];$('.question-container:eq('+i+')',$myDom).attr('class','question-container');question.attach($('.question-container:eq('+i+')',$myDom));registerImageLoadedListener(question);const finishButtonText=(self.isSubmitting)?params.texts.submitButton:params.texts.finishButton
question.addButton('finish',finishButtonText,moveQuestion.bind(this,1),false);question.addButton('next','',moveQuestion.bind(this,1),!params.disableBackwardsNavigation||!!question.getAnswerGiven(),{href:'#','aria-label':params.texts.nextButton});question.addButton('prev','',moveQuestion.bind(this,-1),!(questionInstances[0]===question||params.disableBackwardsNavigation),{href:'#','aria-label':params.texts.prevButton});if(questionInstances[questionInstances.length-1]===question){question.hideButton('next');}
question.on('xAPI',function(event){var shortVerb=event.getVerb();if(shortVerb==='interacted'||shortVerb==='answered'||shortVerb==='attempted'){toggleAnsweredDot(currentQuestion,questionInstances[currentQuestion].getAnswerGiven());_updateButtons();}
if(shortVerb==='completed'){event.setVerb('answered');}
if(event.data.statement.context.extensions===undefined){event.data.statement.context.extensions={};}
event.data.statement.context.extensions['http://id.tincanapi.com/extension/ending-point']=currentQuestion+1;});toggleAnsweredDot(i,question.getAnswerGiven());}}
this.attach=function(target){if(this.isRoot()){this.setActivityStarted();}
if(typeof(target)==="string"){$myDom=$('#'+target);}
else{$myDom=$(target);}
$myDom.children().remove();$myDom.append($template);if(params.backgroundImage!==undefined){$myDom.css({overflow:'hidden',background:'#fff url("'+H5P.getPath(params.backgroundImage.path,contentId)+'") no-repeat 50% 50%',backgroundSize:'100% auto'});}
if(params.introPage.backgroundImage!==undefined){var $intro=$myDom.find('.intro-page');if($intro.length){var bgImg=params.introPage.backgroundImage;var bgImgRatio=(bgImg.height/bgImg.width);$intro.css({background:'#fff url("'+H5P.getPath(bgImg.path,contentId)+'") no-repeat 50% 50%',backgroundSize:'auto 100%',minHeight:bgImgRatio*+window.getComputedStyle($intro[0]).width.replace('px','')});}}
initializeQuestion();$('.questionset',$myDom).addClass('started');$('.qs-startbutton',$myDom).click(function(){$(this).parents('.intro-page').hide();$('.questionset',$myDom).show();_showQuestion(params.initialQuestion);event.preventDefault();}).keydown(function(event){switch(event.which){case 13:case 32:$(this).parents('.intro-page').hide();$('.questionset',$myDom).show();_showQuestion(params.initialQuestion);event.preventDefault();}});var handleProgressDotClick=function(event){event.preventDefault();if(params.disableBackwardsNavigation&&!showingSolutions){return;}
_showQuestion($(this).parent().index());};$('.progress-dot',$myDom).click(handleProgressDotClick).keydown(function(event){var $this=$(this);switch(event.which){case 13:case 32:handleProgressDotClick.call(this,event);break;case 37:case 38:var $prev=$this.parent().prev();if($prev.length){$prev.children('a').attr('tabindex','0').focus();$this.attr('tabindex','-1');}
break;case 39:case 40:var $next=$this.parent().next();if($next.length){$next.children('a').attr('tabindex','0').focus();$this.attr('tabindex','-1');}
break;}});_showQuestion(currentQuestion,true);if(renderSolutions){showSolutions();}
_updateButtons();this.trigger('resize');return this;};this.getScore=function(){var score=0;for(var i=questionInstances.length-1;i>=0;i--){score+=questionInstances[i].getScore();}
return score;};this.getMaxScore=function(){var score=0;for(var i=questionInstances.length-1;i>=0;i--){score+=questionInstances[i].getMaxScore();}
return score;};this.totalScore=function(){return this.getMaxScore();};this.getCopyrights=function(){var info=new H5P.ContentCopyrights();if(params.introPage!==undefined&&params.introPage.backgroundImage!==undefined&&params.introPage.backgroundImage.copyright!==undefined){var introBackground=new H5P.MediaCopyright(params.introPage.backgroundImage.copyright);introBackground.setThumbnail(new H5P.Thumbnail(H5P.getPath(params.introPage.backgroundImage.path,contentId),params.introPage.backgroundImage.width,params.introPage.backgroundImage.height));info.addMedia(introBackground);}
if(params.backgroundImage!==undefined&&params.backgroundImage.copyright!==undefined){var background=new H5P.MediaCopyright(params.backgroundImage.copyright);background.setThumbnail(new H5P.Thumbnail(H5P.getPath(params.backgroundImage.path,contentId),params.backgroundImage.width,params.backgroundImage.height));info.addMedia(background);}
var questionCopyrights;for(var i=0;i<questionInstances.length;i++){var instance=questionInstances[i];var instanceParams=params.questions[i].params;questionCopyrights=undefined;if(instance.getCopyrights!==undefined){questionCopyrights=instance.getCopyrights();}
if(questionCopyrights===undefined){questionCopyrights=new H5P.ContentCopyrights();H5P.findCopyrights(questionCopyrights,instanceParams.params,contentId,{metadata:instanceParams.metadata,machineName:instanceParams.library.split(' ')[0]});}
var label=(params.texts.questionLabel+' '+(i+1));if(instanceParams.params.contentName!==undefined){label+=': '+instanceParams.params.contentName;}
else if(instance.getTitle!==undefined){label+=': '+instance.getTitle();}
questionCopyrights.setLabel(label);info.addContent(questionCopyrights);}
var video;if(params.endGame.successVideo!==undefined&&params.endGame.successVideo.length>0){video=params.endGame.successVideo[0];if(video.copyright!==undefined){info.addMedia(new H5P.MediaCopyright(video.copyright));}}
if(params.endGame.failVideo!==undefined&&params.endGame.failVideo.length>0){video=params.endGame.failVideo[0];if(video.copyright!==undefined){info.addMedia(new H5P.MediaCopyright(video.copyright));}}
return info;};this.getQuestions=function(){return questionInstances;};this.showSolutions=function(){renderSolutions=true;};this.getCurrentState=function(){return{progress:showingSolutions?questionInstances.length-1:currentQuestion,answers:questionInstances.map(function(qi){return qi.getCurrentState();}),order:questionOrder,poolOrder:poolOrder};};var getxAPIDefinition=function(){var definition={};definition.interactionType='compound';definition.type='http://adlnet.gov/expapi/activities/cmi.interaction';definition.description={'en-US':''};return definition;};var addQuestionToXAPI=function(xAPIEvent){var definition=xAPIEvent.getVerifiedStatementValue(['object','definition']);$.extend(definition,getxAPIDefinition());};var getXAPIDataFromChildren=function(metaContentType){return metaContentType.getQuestions().map(function(question){return question.getXAPIData();});};this.getXAPIData=function(){var xAPIEvent=this.createXAPIEventTemplate('answered');addQuestionToXAPI(xAPIEvent);xAPIEvent.setScoredResult(this.getScore(),this.getMaxScore(),this,true,this.getScore()===this.getMaxScore());return{statement:xAPIEvent.data.statement,children:getXAPIDataFromChildren(this)};};this.getContext=function(){let contextObject={type:'question',value:(currentQuestion+1)};if(params.randomQuestions){contextObject.actual=questionOrder[currentQuestion]+1;}
return contextObject;};};H5P.QuestionSet.prototype=Object.create(H5P.EventDispatcher.prototype);H5P.QuestionSet.prototype.constructor=H5P.QuestionSet;