var H5P=H5P||{};H5P.MultiChoice=function(options,contentId,contentData){if(!(this instanceof H5P.MultiChoice))
return new H5P.MultiChoice(options,contentId,contentData);var self=this;this.contentId=contentId;this.contentData=contentData;H5P.Question.call(self,'multichoice');var $=H5P.jQuery;var texttemplate='<ul class="h5p-answers" role="<%= role %>" aria-labelledby="<%= label %>">'+
'  <% for (var i=0; i < answers.length; i++) { %>'+
'    <li class="h5p-answer" role="<%= answers[i].role %>" tabindex="<%= answers[i].tabindex %>" aria-checked="<%= answers[i].checked %>" data-id="<%= i %>">'+
'      <div class="h5p-alternative-container">'+
'        <span class="h5p-alternative-inner"><%= answers[i].text %></span>'+
'      </div>'+
'      <div class="h5p-clearfix"></div>'+
'    </li>'+
'  <% } %>'+
'</ul>';var defaults={image:null,question:"No question text provided",answers:[{tipsAndFeedback:{tip:'',chosenFeedback:'',notChosenFeedback:''},text:"Answer 1",correct:true}],overallFeedback:[],weight:1,userAnswers:[],UI:{checkAnswerButton:'Check',submitAnswerButton:'Submit',showSolutionButton:'Show solution',tryAgainButton:'Try again',scoreBarLabel:'You got :num out of :total points',tipAvailable:"Tip available",feedbackAvailable:"Feedback available",readFeedback:'Read feedback',shouldCheck:"Should have been checked",shouldNotCheck:"Should not have been checked",noInput:'Input is required before viewing the solution',a11yCheck:'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',a11yShowSolution:'Show the solution. The task will be marked with its correct solution.',a11yRetry:'Retry the task. Reset all responses and start the task over again.',},behaviour:{enableRetry:true,enableSolutionsButton:true,enableCheckButton:true,type:'auto',singlePoint:true,randomAnswers:false,showSolutionsRequiresInput:true,autoCheck:false,passPercentage:100,showScorePoints:true}};var template=new EJS({text:texttemplate});var params=$.extend(true,defaults,options);var numCorrect=0;for(var i=0;i<params.answers.length;i++){var answer=params.answers[i];answer.tipsAndFeedback=answer.tipsAndFeedback||{};if(params.answers[i].correct){numCorrect++;}}
var blankIsCorrect=(numCorrect===0);if(params.behaviour.type==='auto'){params.behaviour.singleAnswer=(numCorrect===1);}
else{params.behaviour.singleAnswer=(params.behaviour.type==='single');}
var getCheckboxOrRadioIcon=function(radio,selected){var icon;if(radio){icon=selected?'&#xe603;':'&#xe600;';}
else{icon=selected?'&#xe601;':'&#xe602;';}
return icon;};var $myDom;var $feedbackDialog;var removeFeedbackDialog=function(){$myDom.unbind('click',removeFeedbackDialog);$myDom.find('.h5p-feedback-button, .h5p-feedback-dialog').remove();$myDom.find('.h5p-has-feedback').removeClass('h5p-has-feedback');if($feedbackDialog){$feedbackDialog.remove();}};var score=0;var solutionsVisible=false;var addFeedback=function($element,feedback){$feedbackDialog=$(''+
'<div class="h5p-feedback-dialog">'+
'<div class="h5p-feedback-inner">'+
'<div class="h5p-feedback-text" aria-hidden="true">'+feedback+'</div>'+
'</div>'+
'</div>');if(!$element.find($('.h5p-feedback-dialog')).length){$feedbackDialog.appendTo($element.addClass('h5p-has-feedback'));}};self.registerDomElements=function(){var media=params.media;if(media&&media.type&&media.type.library){media=media.type;var type=media.library.split(' ')[0];if(type==='H5P.Image'){if(media.params.file){self.setImage(media.params.file.path,{disableImageZooming:params.media.disableImageZooming||false,alt:media.params.alt,title:media.params.title});}}
else if(type==='H5P.Video'){if(media.params.sources){self.setVideo(media);}}
else if(type==='H5P.Audio'){if(media.params.files){self.setAudio(media);}}}
for(var i=0;i<params.answers.length;i++){params.answers[i].checkboxOrRadioIcon=getCheckboxOrRadioIcon(params.behaviour.singleAnswer,params.userAnswers.indexOf(i)>-1);}
self.setIntroduction('<div id="'+params.label+'">'+params.question+'</div>');$myDom=$(template.render(params));self.setContent($myDom,{'class':params.behaviour.singleAnswer?'h5p-radio':'h5p-check'});var $answers=$('.h5p-answer',$myDom).each(function(i){var tip=params.answers[i].tipsAndFeedback.tip;if(tip===undefined){return;}
tip=tip.trim();var tipContent=tip.replace(/&nbsp;/g,'').replace(/<p>/g,'').replace(/<\/p>/g,'').trim();if(!tipContent.length){return;}
else{$(this).addClass('h5p-has-tip');}
var $wrap=$('<div/>',{'class':'h5p-multichoice-tipwrap','aria-label':params.UI.tipAvailable+'.'});var $multichoiceTip=$('<div>',{'role':'button','tabindex':0,'title':params.UI.tipsLabel,'aria-label':params.UI.tipsLabel,'aria-expanded':false,'class':'multichoice-tip',appendTo:$wrap});var tipIconHtml='<span class="joubel-icon-tip-normal">'+
'<span class="h5p-icon-shadow"></span>'+
'<span class="h5p-icon-speech-bubble"></span>'+
'<span class="h5p-icon-info"></span>'+
'</span>';$multichoiceTip.append(tipIconHtml);$multichoiceTip.click(function(){var $tipContainer=$multichoiceTip.parents('.h5p-answer');var openFeedback=!$tipContainer.children('.h5p-feedback-dialog').is($feedbackDialog);removeFeedbackDialog();if(openFeedback){$multichoiceTip.attr('aria-expanded',true);addFeedback($tipContainer,tip);$feedbackDialog.addClass('h5p-has-tip');self.read(tip);}
else{$multichoiceTip.attr('aria-expanded',false);}
self.trigger('resize');setTimeout(function(){$myDom.click(removeFeedbackDialog);},100);return false;}).keydown(function(e){if(e.which===32){$(this).click();return false;}});$('.h5p-alternative-container',this).append($wrap);});var toggleCheck=function($ans){if($ans.attr('aria-disabled')==='true'){return;}
self.answered=true;var num=parseInt($ans.data('id'));if(params.behaviour.singleAnswer){params.userAnswers=[num];score=(params.answers[num].correct?1:0);$answers.not($ans).removeClass('h5p-selected').attr('tabindex','-1').attr('aria-checked','false');$ans.addClass('h5p-selected').attr('tabindex','0').attr('aria-checked','true');}
else{if($ans.attr('aria-checked')==='true'){const pos=params.userAnswers.indexOf(num);if(pos!==-1){params.userAnswers.splice(pos,1);}
if(params.behaviour.autoCheck&&!params.behaviour.enableRetry){return;}
$ans.removeClass('h5p-selected').attr('aria-checked','false');}
else{params.userAnswers.push(num);$ans.addClass('h5p-selected').attr('aria-checked','true');}
calcScore();}
self.triggerXAPI('interacted');hideSolution($ans);if(params.userAnswers.length){self.showButton('check-answer');self.hideButton('try-again');self.hideButton('show-solution');if(params.behaviour.autoCheck){if(params.behaviour.singleAnswer){checkAnswer();}
else{self.showCheckSolution(true);if(score===self.getMaxScore()){checkAnswer();}}}}};$answers.click(function(){toggleCheck($(this));}).keydown(function(e){if(e.keyCode===32){toggleCheck($(this));return false;}
if(params.behaviour.singleAnswer){switch(e.keyCode){case 38:case 37:{var $prev=$(this).prev();if($prev.length){toggleCheck($prev.focus());}
return false;}
case 40:case 39:{var $next=$(this).next();if($next.length){toggleCheck($next.focus());}
return false;}}}});if(params.behaviour.singleAnswer){$answers.focus(function(){if($(this).attr('aria-disabled')!=='true'){$answers.not(this).attr('tabindex','-1');}}).blur(function(){if(!$answers.filter('.h5p-selected').length){$answers.first().add($answers.last()).attr('tabindex','0');}});}
addButtons();if(!params.behaviour.singleAnswer){calcScore();}
else{if(params.userAnswers.length&&params.answers[params.userAnswers[0]].correct){score=1;}
else{score=0;}}
if(hasCheckedAnswer&&params.behaviour.autoCheck){if(params.behaviour.singleAnswer||score===self.getMaxScore()){checkAnswer();}
else{self.showCheckSolution(true);}}};this.showAllSolutions=function(){if(solutionsVisible){return;}
solutionsVisible=true;$myDom.find('.h5p-answer').each(function(i,e){var $e=$(e);var a=params.answers[i];if(a.correct){$e.addClass('h5p-should').append($('<span/>',{'class':'h5p-solution-icon',html:params.UI.shouldCheck+'.'}));}
else{$e.addClass('h5p-should-not').append($('<span/>',{'class':'h5p-solution-icon',html:params.UI.shouldNotCheck+'.'}));}}).find('.h5p-question-plus-one, .h5p-question-minus-one').remove();disableInput();$myDom.find('.h5p-answer.h5p-should').first().focus();self.hideButton('check-answer');self.hideButton('show-solution');if(params.behaviour.enableRetry){self.showButton('try-again');}
self.trigger('resize');};this.showSolutions=function(){removeFeedbackDialog();self.showCheckSolution();self.showAllSolutions();disableInput();self.hideButton('try-again');};var hideSolution=function($answer){$answer.removeClass('h5p-correct').removeClass('h5p-wrong').removeClass('h5p-should').removeClass('h5p-should-not').removeClass('h5p-has-feedback').find('.h5p-question-plus-one, .h5p-question-minus-one, .h5p-answer-icon, .h5p-solution-icon, .h5p-feedback-dialog').remove();};this.hideSolutions=function(){solutionsVisible=false;hideSolution($('.h5p-answer',$myDom));this.removeFeedback();self.trigger('resize');};this.resetTask=function(){self.answered=false;self.hideSolutions();params.userAnswers=[];removeSelections();self.showButton('check-answer');self.hideButton('try-again');self.hideButton('show-solution');enableInput();$myDom.find('.h5p-feedback-available').remove();};var calculateMaxScore=function(){if(blankIsCorrect){return params.weight;}
var maxScore=0;for(var i=0;i<params.answers.length;i++){var choice=params.answers[i];if(choice.correct){maxScore+=(choice.weight!==undefined?choice.weight:1);}}
return maxScore;};this.getMaxScore=function(){return(!params.behaviour.singleAnswer&&!params.behaviour.singlePoint?calculateMaxScore():params.weight);};var checkAnswer=function(){$myDom.unbind('click',removeFeedbackDialog);removeFeedbackDialog();if(params.behaviour.enableSolutionsButton){self.showButton('show-solution');}
if(params.behaviour.enableRetry){self.showButton('try-again');}
self.hideButton('check-answer');self.showCheckSolution();disableInput();var xAPIEvent=self.createXAPIEventTemplate('answered');addQuestionToXAPI(xAPIEvent);addResponseToXAPI(xAPIEvent);self.trigger(xAPIEvent);};var isAnswerSelected=function(){return!!$('.h5p-answer[aria-checked="true"]',$myDom).length;};var addButtons=function(){var $content=$('[data-content-id="'+self.contentId+'"].h5p-content');var $containerParents=$content.parents('.h5p-container');var $container;if($containerParents.length!==0){$container=$containerParents.last();}
else if($content.length!==0){$container=$content;}
else{$container=$(document.body);}
self.addButton('show-solution',params.UI.showSolutionButton,function(){if(params.behaviour.showSolutionsRequiresInput&&!isAnswerSelected()){self.updateFeedbackContent(params.UI.noInput);self.read(params.UI.noInput);}
else{calcScore();self.showAllSolutions();}},false,{'aria-label':params.UI.a11yShowSolution,});if(params.behaviour.enableCheckButton&&(!params.behaviour.autoCheck||!params.behaviour.singleAnswer)){self.addButton('check-answer',params.UI.checkAnswerButton,function(){self.answered=true;checkAnswer();},true,{'aria-label':params.UI.a11yCheck,},{confirmationDialog:{enable:params.behaviour.confirmCheckDialog,l10n:params.confirmCheck,instance:self,$parentElement:$container},contentData:self.contentData,textIfSubmitting:params.UI.submitAnswerButton,});}
self.addButton('try-again',params.UI.tryAgainButton,function(){self.resetTask();if(params.behaviour.randomAnswers){var oldIdMap=idMap;idMap=getShuffleMap();var answersDisplayed=$myDom.find('.h5p-answer');var tip=[];for(i=0;i<answersDisplayed.length;i++){tip[i]=$(answersDisplayed[i]).find('.h5p-multichoice-tipwrap');}
for(i=0;i<answersDisplayed.length;i++){$(answersDisplayed[i]).find('.h5p-alternative-inner').html(params.answers[i].text);$(tip[i]).detach().appendTo($(answersDisplayed[idMap.indexOf(oldIdMap[i])]).find('.h5p-alternative-container'));}}},false,{'aria-label':params.UI.a11yRetry,},{confirmationDialog:{enable:params.behaviour.confirmRetryDialog,l10n:params.confirmRetry,instance:self,$parentElement:$container}});};var insertFeedback=function($e,feedback){addFeedback($e,feedback);var $wrap=$('<div/>',{'class':'h5p-hidden-read h5p-feedback-available','aria-label':params.UI.feedbackAvailable+'.'});$('<div/>',{'role':'button','tabindex':0,'aria-label':params.UI.readFeedback+'.',appendTo:$wrap,on:{keydown:function(e){if(e.which===32){self.read(feedback);return false;}}}});$wrap.appendTo($e);};var getFeedbackText=function(score,max){var ratio=(score/max);var feedback=H5P.Question.determineOverallFeedback(params.overallFeedback,ratio);return feedback.replace('@score',score).replace('@total',max);};this.showCheckSolution=function(skipFeedback){var scorePoints;if(!(params.behaviour.singleAnswer||params.behaviour.singlePoint||!params.behaviour.showScorePoints)){scorePoints=new H5P.Question.ScorePoints();}
$myDom.find('.h5p-answer').each(function(i,e){var $e=$(e);var a=params.answers[i];var chosen=($e.attr('aria-checked')==='true');if(chosen){if(a.correct){if(!$e.hasClass('h5p-correct')){$e.addClass('h5p-correct').append($('<span/>',{'class':'h5p-answer-icon',html:params.UI.correctAnswer+'.'}));}}
else{if(!$e.hasClass('h5p-wrong')){$e.addClass('h5p-wrong').append($('<span/>',{'class':'h5p-answer-icon',html:params.UI.wrongAnswer+'.'}));}}
if(scorePoints){var alternativeContainer=$e[0].querySelector('.h5p-alternative-container');if(!params.behaviour.autoCheck||alternativeContainer.querySelector('.h5p-question-plus-one, .h5p-question-minus-one')===null){alternativeContainer.appendChild(scorePoints.getElement(a.correct));}}}
if(!skipFeedback){if(chosen&&a.tipsAndFeedback.chosenFeedback!==undefined&&a.tipsAndFeedback.chosenFeedback!==''){insertFeedback($e,a.tipsAndFeedback.chosenFeedback);}
else if(!chosen&&a.tipsAndFeedback.notChosenFeedback!==undefined&&a.tipsAndFeedback.notChosenFeedback!==''){insertFeedback($e,a.tipsAndFeedback.notChosenFeedback);}}});var max=self.getMaxScore();var fullScore=(score===max);if(fullScore){self.hideButton('check-answer');self.hideButton('try-again');self.hideButton('show-solution');}
if(!skipFeedback){this.setFeedback(getFeedbackText(score,max),score,max,params.UI.scoreBarLabel);}
self.trigger('resize');};var disableInput=function(){$('.h5p-answer',$myDom).attr({'aria-disabled':'true','tabindex':'-1'});};var enableInput=function(){$('.h5p-answer',$myDom).attr('aria-disabled','false');};var calcScore=function(){score=0;for(const answer of params.userAnswers){const choice=params.answers[answer];const weight=(choice.weight!==undefined?choice.weight:1);if(choice.correct){score+=weight;}
else{score-=weight;}}
if(score<0){score=0;}
if(!params.userAnswers.length&&blankIsCorrect){score=params.weight;}
if(params.behaviour.singlePoint){score=(100*score/calculateMaxScore())>=params.behaviour.passPercentage?params.weight:0;}};var removeSelections=function(){var $answers=$('.h5p-answer',$myDom).removeClass('h5p-selected').attr('aria-checked','false');if(!params.behaviour.singleAnswer){$answers.attr('tabindex','0');}
else{$answers.first().attr('tabindex','0');}
$answers.first().focus();calcScore();};this.getXAPIData=function(){var xAPIEvent=this.createXAPIEventTemplate('answered');addQuestionToXAPI(xAPIEvent);addResponseToXAPI(xAPIEvent);return{statement:xAPIEvent.data.statement};};var addQuestionToXAPI=function(xAPIEvent){var definition=xAPIEvent.getVerifiedStatementValue(['object','definition']);definition.description={'en-US':$('<div>'+params.question+'</div>').text()};definition.type='http://adlnet.gov/expapi/activities/cmi.interaction';definition.interactionType='choice';definition.correctResponsesPattern=[];definition.choices=[];for(var i=0;i<params.answers.length;i++){definition.choices[i]={'id':params.answers[i].originalOrder+'','description':{'en-US':$('<div>'+params.answers[i].text+'</div>').text()}};if(params.answers[i].correct){if(!params.singleAnswer){if(definition.correctResponsesPattern.length){definition.correctResponsesPattern[0]+='[,]';}
else{definition.correctResponsesPattern.push('');}
definition.correctResponsesPattern[0]+=params.answers[i].originalOrder;}
else{definition.correctResponsesPattern.push(''+params.answers[i].originalOrder);}}}};var addResponseToXAPI=function(xAPIEvent){var maxScore=self.getMaxScore();var success=(100*score/maxScore)>=params.behaviour.passPercentage;xAPIEvent.setScoredResult(score,maxScore,self,true,success);if(params.userAnswers===undefined){calcScore();}
var response='';for(var i=0;i<params.userAnswers.length;i++){if(response!==''){response+='[,]';}
response+=idMap===undefined?params.userAnswers[i]:idMap[params.userAnswers[i]];}
xAPIEvent.data.statement.result.response=response;};var getShuffleMap=function(){params.answers=H5P.shuffleArray(params.answers);var idMap=[];for(i=0;i<params.answers.length;i++){idMap[i]=params.answers[i].originalOrder;}
return idMap;};var idMap;for(i=0;i<params.answers.length;i++){params.answers[i].originalOrder=i;}
if(params.behaviour.randomAnswers){idMap=getShuffleMap();}
params.userAnswers=[];if(contentData&&contentData.previousState!==undefined){if(contentData.previousState.answers){if(!idMap){params.userAnswers=contentData.previousState.answers;}
else{for(i=0;i<contentData.previousState.answers.length;i++){for(var k=0;k<idMap.length;k++){if(idMap[k]===contentData.previousState.answers[i]){params.userAnswers.push(k);}}}}
calcScore();}}
var hasCheckedAnswer=false;for(var j=0;j<params.answers.length;j++){var ans=params.answers[j];if(!params.behaviour.singleAnswer){ans.role='checkbox';ans.tabindex='0';if(params.userAnswers.indexOf(j)!==-1){ans.checked='true';hasCheckedAnswer=true;}}
else{ans.role='radio';if(params.userAnswers.length===0){if(i===0||i===params.answers.length){ans.tabindex='0';}}
else if(params.userAnswers.indexOf(j)!==-1){ans.tabindex='0';ans.checked='true';hasCheckedAnswer=true;}}
if(ans.tabindex===undefined){ans.tabindex='-1';}
if(ans.checked===undefined){ans.checked='false';}}
H5P.MultiChoice.counter=(H5P.MultiChoice.counter===undefined?0:H5P.MultiChoice.counter+1);params.role=(params.behaviour.singleAnswer?'radiogroup':'group');params.label='h5p-mcq'+H5P.MultiChoice.counter;this.getCurrentState=function(){var state={};if(!idMap){state.answers=params.userAnswers;}
else{state.answers=[];for(var i=0;i<params.userAnswers.length;i++){state.answers.push(idMap[params.userAnswers[i]]);}}
return state;};this.getAnswerGiven=function(ignoreCheck){var answered=ignoreCheck?false:this.answered;return answered||params.userAnswers.length>0||blankIsCorrect;};this.getScore=function(){return score;};this.getTitle=function(){return H5P.createTitle((this.contentData&&this.contentData.metadata&&this.contentData.metadata.title)?this.contentData.metadata.title:'Multiple Choice');};};H5P.MultiChoice.prototype=Object.create(H5P.Question.prototype);H5P.MultiChoice.prototype.constructor=H5P.MultiChoice;