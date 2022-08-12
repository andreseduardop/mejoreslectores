var H5P=H5P||{};H5P.TextUtilities=function(){'use strict';function TextUtilities(){}
TextUtilities.prototype=Object.create(H5P.EventDispatcher.prototype);TextUtilities.prototype.constructor=TextUtilities;TextUtilities.WORD_DELIMITER=/[\s.?!,\';\"]/g;TextUtilities.isIsolated=function(candidate,text,params){if(!candidate||!text){return;}
var delimiter=(!!params&&!!params.delimiter)?params.delimiter:TextUtilities.WORD_DELIMITER;var pos=(!!params&&!!params.index&&typeof params.index==='number')?params.index:text.indexOf(candidate);if(pos<0||pos>text.length-1){return false;}
var pred=(pos===0?'':text[pos-1].replace(delimiter,''));var succ=(pos+candidate.length===text.length?'':text[pos+candidate.length].replace(delimiter,''));if(pred!==''||succ!==''){return false;}
return true;};TextUtilities.areSimilar=function(string1,string2){if(!string1||typeof string1!=='string'){return;}
if(!string2||typeof string2!=='string'){return;}
var length=Math.min(string1.length,string2.length);var levenshtein=H5P.TextUtilities.computeLevenshteinDistance(string1,string2,true);if(levenshtein===0){return true;}
if((length>9)&&(levenshtein<=2)){return true;}
if((length>3)&&(levenshtein<=1)){return true;}
return false;};TextUtilities.computeLevenshteinDistance=function(str1,str2,countSwapping){if(typeof str1!=='string'||typeof str2!=='string'){return undefined;}
if(countSwapping&&typeof countSwapping!=='boolean'){countSwapping=false;}
if(str1===str2){return 0;}
if(str1.length===0){return str2.length;}
if(str2.length===0){return str1.length;}
var i,j;var cost;var distance=[];for(i=0;i<=str1.length;i++){distance[i]=[i];}
for(j=0;j<=str2.length;j++){distance[0][j]=j;}
for(i=1;i<=str1.length;i++){for(j=1;j<=str2.length;j++){cost=(str1[i-1]===str2[j-1])?0:1;distance[i][j]=Math.min(distance[i-1][j]+1,distance[i][j-1]+1,distance[i-1][j-1]+cost);if(countSwapping){if(i>1&&j>1&&str1[i-1]===str2[j-2]&&str1[i-2]===str2[j-1]){distance[i][j]=Math.min(distance[i][j],distance[i-2][j-2]+cost);}}}}
return distance[str1.length][str2.length];};TextUtilities.computeJaroDistance=function(str1,str2,favorSameStart,longTolerance){if(typeof str1!=='string'||typeof str2!=='string'){return undefined;}
if(favorSameStart&&typeof favorSameStart!=='boolean'){favorSameStart=false;}
if(longTolerance&&typeof longTolerance!=='boolean'){longTolerance=false;}
if(str1.length===0||str2.length===0){return 0;}
if(str1===str2){return 1;}
var i,j,k;var matches=0;var transpositions=0;var distance=0;var l=0;var p=0.1;var str1Len=str1.length;var str2Len=str2.length;var matchWindow=Math.floor(Math.max(str1Len,str2Len)/2)-1;var str1Flags=new Array(str1Len);var str2Flags=new Array(str2Len);for(i=0;i<str1Len;i++){var start=(i>=matchWindow)?i-matchWindow:0;var end=(i+matchWindow<=(str2Len-1))?(i+matchWindow):(str2Len-1);for(j=start;j<=end;j++){if(str1Flags[i]!==true&&str2Flags[j]!==true&&str1[i]===str2[j]){str1Flags[i]=str2Flags[j]=true;matches+=1;break;}}}
if(matches===0){return 0;}
k=0;for(i=0;i<str1Len;i++){if(!str1Flags[i]){continue;}
while(!str2Flags[k]){k+=1;}
if(str1[i]!==str2[k]){transpositions+=1;}
k+=1;}
transpositions=transpositions/2;distance=(matches/str1Len+matches/str2Len+(matches-transpositions)/matches)/3;if(favorSameStart){if(distance>0.7&&str1Len>3&&str2Len>3){while(str1[l]===str2[l]&&l<4){l+=1;}
distance=distance+l*p*(1-distance);if(longTolerance){if(Math.max(str1Len,str2Len)>4&&matches>l+1&&2*matches>=Math.max(str1Len,str2Len)+l){distance+=((1.0-distance)*((matches-l-1)/(str1Len+str2Len-2*l+2)));}}}}
return distance;};TextUtilities.fuzzyContains=function(needle,haystack){return this.fuzzyFind(needle,haystack).contains;};TextUtilities.fuzzyIndexOf=function(needle,haystack){return this.fuzzyFind(needle,haystack).indexOf;};TextUtilities.fuzzyMatch=function(needle,haystack){return this.fuzzyFind(needle,haystack).match;};TextUtilities.fuzzyFind=function(needle,haystack,params){if(!needle||typeof needle!=='string'){return false;}
if(!haystack||typeof haystack!=='string'){return false;}
if(params===undefined||params.windowSize===undefined||typeof params.windowSize!=='number'){params={'windowSize':3};}
var match;var found=haystack.split(' ').some(function(hay){match=hay;return H5P.TextUtilities.areSimilar(needle,hay);});if(found){return{'contains':found,'match':match,'index':haystack.indexOf(match)};}
for(var i=0;i<haystack.length-needle.length+1;i++){var hay=[];for(var j=0;j<params.windowSize;j++){hay[j]=haystack.substr(i,needle.length+j);}
for(var j=0;j<hay.length;j++){if(TextUtilities.isIsolated(hay[j],haystack)&&TextUtilities.areSimilar(hay[j],needle)){match=hay[j];found=true;break;}}
if(found){break;}}
if(!found){match=undefined;}
return{'contains':found,'match':match,'index':haystack.indexOf(match)};};return TextUtilities;}();