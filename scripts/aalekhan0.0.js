/*
 * aalekhan0.0.js
 * 
 * Copyright 2014 Nisarg Jhaveri <nisargjhaveri@gmail.com>
 * 
 */
var Aalekhan = new (function(){
    var fcl=new Array();fcl[0]='#1859a9';fcl[1]='#ed2d2e';fcl[2]='#008c47';fcl[3]='#562d76';fcl[4]='#f16f06';fcl[5]='#b64482';fcl[6]='#40e89d';fcl[7]='#ff00ff';var fcu=new Array();fcu[0]=0;fcu[1]=0;fcu[2]=0;fcu[3]=0;fcu[4]=0;fcu[5]=0;fcu[6]=0;fcu[7]=0;var exss=new Array();var fEvalTmp=new Array();var f,fInfo;var fReady=0;var functionListOld=new Array();var functionListNew=new Array();var whfc=function(func,fI){func=func.replace(/\s/g,'').toLowerCase();if(!exss[fI])exss[fI]=new Object();exss[fI].errCode=new Array();var condAll=func.split(';');if(condAll.length>1){exss[fI].conds=new Array();exss[fI].humanConds=new Array();exss[fI].evalConds=new Array();exss[fI].humanCondToShow=new Array();exss[fI].condMeta=new Array();exss[fI].humanCondToShow[condI]='';var condI;for(condI=1;condI<condAll.length;condI++){  var evaluatedCond=ehc(condAll[condI], exss[fI].conds.length);exss[fI].conds=exss[fI].conds.concat(evaluatedCond.fct);exss[fI].humanConds=exss[fI].humanConds.concat(evaluatedCond.hct);exss[fI].evalConds=exss[fI].evalConds.concat(evaluatedCond.ect);exss[fI].humanCondToShow[condI-1]=evaluatedCond.hctst;exss[fI].condMeta=exss[fI].condMeta.concat(evaluatedCond.cmt);if(evaluatedCond.Errors)exss[fI].errCode=exss[fI].errCode.concat(evaluatedCond.Errors);}}var evaluatedFn=ehf(condAll[0],false);if(evaluatedFn==false){exss[fI].errCode[0]=0;exss[fI].humanF='';exss[fI].evalF='000er000';fReady=0;exss[fI].depend=0;exss[fI].equal=0;return false;}else if(evaluatedFn.depend==4 && condAll.length>1){ exss[fI].errCode.push(20);}exss[fI].humanF=evaluatedFn.hft;exss[fI].fAll=evaluatedFn.aft;exss[fI].evalF=evaluatedFn.eft;if(evaluatedFn.Errors)exss[fI].errCode=exss[fI].errCode.concat(evaluatedFn.Errors);exss[fI].depend=evaluatedFn.depend;exss[fI].equal=evaluatedFn.xEq;if(typeof(exss[fI].conds)!='undefined'){exss[fI].humanF=exss[fI].humanF+' ; '+exss[fI].humanCondToShow.join(' ; ');}exss[fI].errCode=exss[fI].errCode.filter(function(val, index, arr){return arr.indexOf(val) == index;});if(exss[fI].errCode.length && exss[fI].errCode[0]!=0){exss[fI].evalF='000er000';}exss[fI].value=func;};
    var ehc=function(cond,condBaseNo){var gcio=gci(cond);var Errors=gcio.Errors;var patt1=/(<=|>=|!=|<|>|=)/g;var subConds=cond.split(patt1);var condItmp;var hct=new Array();var hctst='';var ect=new Array();var fct=new Array();var cmt=new Array();var lastCondI,currCondI;var latexSym={'=': '= ','<': '\\lt ','>': '\\gt ','<=': '\\le ','>=': '\\ge ','!=': '\\ne '};var condItmp;for(condItmp=0;condItmp<subConds.length;condItmp++){if(condItmp&1){hctst+=latexSym[subConds[condItmp]];if(subConds[condItmp]=="=")subConds[condItmp]="==";continue;}var evaluatedFn=ehf(subConds[condItmp],true);if(evaluatedFn==false){Errors.push(17);}else if(evaluatedFn.hasPM){Errors.push(18);}if(evaluatedFn.Errors)Errors=Errors.concat(evaluatedFn.Errors);currCondI=fct.push(evaluatedFn.aft);hct.push(evaluatedFn.hft);hctst+=evaluatedFn.hft;ect.push(evaluatedFn.eft);if(condItmp){cmt.push(new Array(lastCondI+condBaseNo-1, subConds[condItmp-1], currCondI+condBaseNo-1));}lastCondI=currCondI;}return {'fct': fct,'ect': ect,'cmt': cmt,'hct': hct,'hctst': hctst,'Errors': Errors};};
    var gci=function(cond){cond=cond.replace(/\s/g,'').toLowerCase();var Errors=new Array();patt1=/[^<>!]=/g;var condErr=cond.match(patt1);if(Array.isArray(condErr)){Errors.push(19);}var patt1=/(<=|>=|!=|=)(<=|>=|!=|<|>|=)/g;var condErr=cond.match(patt1);if(Array.isArray(condErr)){Errors.push(17);}var patt1=/(<|>|=)(<=|>=|!=|<|>)/g;var condErr=cond.match(patt1);if(Array.isArray(condErr)){Errors.push(17);}var patt1=/^(<=|>=|!=|<|>|=)/g;var condErr=cond.match(patt1);if(Array.isArray(condErr)){Errors.push(17);}var patt1=/(<=|>=|!=|<|>|=)$/g;var condErr=cond.match(patt1);if(Array.isArray(condErr)){Errors.push(17);}var patt1=/(<=|>=|!=|<|>|=)/g;var subConds=cond.split(patt1);if(!subConds.length&1 || subConds.length < 2){Errors.push(17);}return {'Errors': Errors};};var eht=function(gfio){var func=gfio.func;var Errors=gfio.Errors;var hft='';var aft=new Array();var patt=/(\((-?(\d*.?\d+|pi|p|π|e)),(-?(\d*.?\d+|pi|p|π|e))\))/g;var pairs=func.match(patt);if(Array.isArray(pairs)){var tableI;var pairX,pairY,humanX,humanY;var patt=/\((-?(\d*.?\d+|pi|p|π|e)),(-?(\d*.?\d+|pi|p|π|e))\)/g;for(tableI=0;tableI<pairs.length;tableI++){pairX=pairs[tableI].replace(patt,'\$1');pairY=pairs[tableI].replace(patt,'\$3');humanX=pairX;humanX=humanX.replace(/(pi|p)/g,'\\pi');humanY=pairY;humanY=humanY.replace(/(pi|p)/g,'\\pi');pairX=pairX.replace(/(pi|p)/g,Math.PI);pairX=pairX.replace(/e/g,Math.E);pairY=pairY.replace(/(pi|p)/g,Math.PI);pairY=pairY.replace(/e/g,Math.E);aft.push([pairX,pairY]);if(tableI)hft+=',';hft+='\\left('+humanX+','+humanY+'\\right)';}}var eft=aft.slice();return {'hft': hft,'aft': aft,'eft': eft,'Errors': Errors,'depend': 4,'xEq': 2}};
    var ehf=function(func,isCond){if(func==''){f='';fInfo='';return false;}f=new Array();fInfo=new Array();var aft;var eft;var hft;func=func.replace(/\s/g,'').toLowerCase();var gfio=getFInfo(func,isCond);if(gfio.type==1){return eht(gfio);}var Errors=gfio.Errors;var xDepend=gfio.xDepend;var yDepend=gfio.yDepend;var thetaDepend=gfio.thetaDepend;var xEq=gfio.xEq;func=gfio.func;var hasPM=gfio.hasPM;f[0]=func;fInfo[0]=0;if(Errors.length){eft='000er000';return {'hft': hft,'aft': aft,'eft': eft,'Errors': Errors,'depend': 0,'xEq': 0,'hasPM': hasPM}}var fr=new Array(['max','maz'],['ceil','cil'],['arcsin','ain'],['arccos','aos'],['arctan','aan'],['sinh','sih'],['cosh','coh'],['tanh','tah']);var noOfFunc=fr.length;for(funcConI=0;funcConI<noOfFunc;funcConI++){f[0]=f[0].replace(fr[funcConI][0],fr[funcConI][1]);}var fPMi;var patt1=/(\+\-)/;var fPM=new Array();fPM[0]=f[0];for(fPMi=0;fPMi<fPM.length;fPMi++){var PlusOrMinus=fPM[fPMi].match(patt1);if(Array.isArray(PlusOrMinus)){fPM[fPM.length]=fPM[fPMi].replace(patt1,'+');fPM[fPM.length]=fPM[fPMi].replace(patt1,'-');}}if(fPM.length>1)fPM.splice(1,((fPM.length-1)/2)-1);var patt1=/(^|sin|cos|log|ln|tan|sqrt|abs|floor|cil|round|ain|aos|aan|sih|coh|tah|\*|\/|\^|\()(\+)/g;var patt2=/\)/g;for(fPMi=1;fPMi<fPM.length;fPMi++){fPM[fPMi]=fPM[fPMi].replace(patt1,'\$1');}for(fPMi=0;fPMi<fPM.length;fPMi++){f=new Array();fInfo=new Array();fInfo[0]=0;f[0]=fPM[fPMi];var pattS = /\[([^\[]*)\]/g;while(f[0].match(pattS)){var STemp=f[0].match(pattS);if(Array.isArray(STemp)){f[0]=f[0].replace(pattS,"floor($1)");}}var patt = /(\d*(\.)?\d+)/g;f[0]=f[0].replace(patt,'numb\$1');var patt = /numb(\d*(\.)?\d+)/g;var decim,decimi;if(decim=f[0].match(patt)){for(decimi=0;decimi<decim.length;decimi++){var temp=f.length;f[temp]=decim[decimi].replace(patt,'\$1');fInfo[temp]=3;f[0]=f[0].replace(decim[decimi],'f['+temp+']');}}var temp=f.length;var patt=/(pi|p|π)/g;if(f[0].match(patt)){f[0]=f[0].replace(patt,'f['+temp+']');f[temp]='p';fInfo[temp]=6;};var temp=f.length;var patt=/(theta|θ)/g;if(f[0].match(patt)){f[0]=f[0].replace(patt,'f['+temp+']');f[temp]='theta';fInfo[temp]=9;}if(isCond){var temp=f.length;var patt=/r/g;if(f[0].match(patt)){f[0]=f[0].replace(patt,'f['+temp+']');f[temp]='r';fInfo[temp]=10;}}var temp=f.length;var patt=/e/g;if(f[0].match(patt)){f[0]=f[0].replace(patt,'f['+temp+']');f[temp]='e';fInfo[temp]=7;}brackets();var pattS,flen,funs,STemp,DoNotCreateNew,Sk,pattTemp,fNo,fCheck,tempS;pattS = /(min|maz)(f\[\d+\])/g;flen=f.length;for(funs=0;funs<flen;funs++){STemp=f[funs].match(pattS);if(Array.isArray(STemp)){if(STemp.length==1 && STemp[0]==f[funs]){DoNotCreateNew=1;}else {DoNotCreateNew=0;}for(Sk=0;Sk<STemp.length;Sk++){pattTemp = /(min|maz)f\[(\d+)\]/g;fNo=STemp[Sk].replace(pattTemp,'\$2');fCheck=fInfo[fNo];if(fCheck!=1)continue;if(DoNotCreateNew)tempS=funs;else tempS=f.length;f[tempS]=STemp[Sk];f[tempS]=f[tempS].replace('f['+fNo+']',f[fNo]);fInfo[tempS]=8;if(!DoNotCreateNew)f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');}}}pattS = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)(f\[\d+\])/g;flen=f.length;for(funs=0;funs<flen;funs++){STemp=f[funs].match(pattS);if(Array.isArray(STemp)){if(STemp.length==1 && STemp[0]==f[funs]){break;}for(Sk=0;Sk<STemp.length;Sk++){pattTemp = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)f\[(\d+)\]/g;fCheck=fInfo[STemp[Sk].replace(pattTemp,'\$2')];if(fCheck==3 || fCheck==6 || fCheck==7)continue;tempS=f.length;f[tempS]=STemp[Sk];fInfo[tempS]=4;f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');}}}multiCorrect();flen=f.length;for(funs=0;funs<flen;funs++){STemp=f[funs].match(/\|/g);if(Array.isArray(STemp)){if(STemp.length%2!=0){break;}if(STemp.length==2 && (f[funs][0]!='|' || f[funs][f[funs].length-1]!='|')){f[funs]=f[funs].replace(/\|(.*)\|/,'abs(\$1)');}}}brackets();pattS = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)(\+\-|\-)?(x|y|\d+|f\[\d+\])/g;flen=f.length;for(funs=0;funs<flen;funs++){while(f[funs].match(pattS)){STemp=f[funs].match(pattS);if(Array.isArray(STemp)){if(STemp.length==1 && STemp[0]==f[funs]){break;}for(Sk=0;Sk<STemp.length;Sk++){tempS=f.length;f[tempS]=STemp[Sk];fInfo[tempS]=4;f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');}}multiCorrect();}}pattS = /(x|y|\d+|f\[\d+\])\^(\+\-|\-)?(x|y|\d+|f\[\d+\])/g;flen=f.length;for(funs=0;funs<flen;funs++){while(f[funs].match(pattS)){STemp=f[funs].match(pattS);if(Array.isArray(STemp)){for(Sk=0;Sk<STemp.length;Sk++){if(STemp.length==1 && STemp[0]==f[funs]){tempS=funs;}else {tempS=f.length;}f[tempS]=STemp[Sk].replace(pattS,'pow\$1,\$2\$3');fInfo[tempS]=4;f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');}}multiCorrect();}}pattS = /(x|y|\d+|f\[\d+\])\/(x|y|\d+|f\[\d+\])/g;flen=f.length;for(funs=0;funs<flen;funs++){while(f[funs].match(pattS)){STemp=f[funs].match(pattS);if(Array.isArray(STemp)){if(STemp.length==1 && STemp[0]==f[funs]){fInfo[funs]=5;break;}for(Sk=0;Sk<STemp.length;Sk++){tempS=f.length;f[tempS]=STemp[Sk];fInfo[tempS]=5;f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');}}multiCorrect();}}var i;for(i=0;i<f.length;i++){if(f[i].substr(0,3)=='sin'){f[i]=f[i].replace('sin','sinf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='cos'){f[i]=f[i].replace('cos','cosf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='tan'){f[i]=f[i].replace('tan','tanf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='ain'){ f[i]=f[i].replace('ain','ainf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='aos'){ f[i]=f[i].replace('aos','aosf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='aan'){ f[i]=f[i].replace('aan','aanf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='sih'){ f[i]=f[i].replace('sih','sihf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='coh'){ f[i]=f[i].replace('coh','cohf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='tah'){ f[i]=f[i].replace('tah','tahf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='abs'){f[i]=f[i].replace('abs','absf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,5)=='floor'){f[i]=f[i].replace('floor','floorf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='cil'){f[i]=f[i].replace('cil','cilf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,5)=='round'){f[i]=f[i].replace('round','roundf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='log'){f[i]=f[i].replace('log','logf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='pow'){f[i]=f[i].replace('pow','powf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,2)=='ln'){f[i]=f[i].replace('ln','lnf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,4)=='sqrt'){f[i]=f[i].replace('sqrt','sqrtf(');f[i]=f[i]+')';fInfo[i]=4;}if(f[i].substr(0,3)=='min'){f[i]=f[i].replace('min','minf([');f[i]=f[i]+'])';fInfo[i]=8;}if(f[i].substr(0,3)=='maz'){f[i]=f[i].replace('maz','mazf([');f[i]=f[i]+'])';fInfo[i]=8;}if(f[i][0]=='|' && f[i][f[i].length-1]=='|'){f[i]=f[i].substr(1,f[i].length-2);f[i]='absf('+f[i]+')';fInfo[i]=4;}if(f[i]=='p'){f[i]=Math.PI;fInfo[i]=6;}if(f[i]=='e'){f[i]=Math.E;fInfo[i]=7;}}var seq=new Array();var patt1=/f\[(\d+)\]/g;var seqi,seqm;seq[0]=0;for(seqi=0;seqi<seq.length;seqi++){if(fInfo[seq[seqi]]==6 || fInfo[seq[seqi]]==7)continue;seqm=f[seq[seqi]].match(patt1);if(Array.isArray(seqm)){for(l=0;l<seqm.length;l++){seq[seq.length]=seqm[l].replace(patt1,'\$1');}}}var fEvalTmp=f.slice(0);var patt1=/f\[(\d+)\]/g;var i;for(i=0;i<fEvalTmp.length;i++){if(typeof fEvalTmp[i]=='string')fEvalTmp[i]=fEvalTmp[i].replace(patt1,'fEvalTmp[\$1]');}var str='er=0;';for(seqi=seq.length-1;seqi>=0;seqi--){str+='if(er==0){fEvalTmp['+seq[seqi]+']='+fEvalTmp[seq[seqi]]+';}if(er==1 || isNaN(fEvalTmp['+seq[seqi]+'])){fEvalTmp['+seq[seqi]+']=Number.NaN;er=1;}';}if(fPM.length>1 && fPMi!=0){ if(!Array.isArray(aft))aft=new Array();aft[fPMi-1]=f.slice(0);if(!Array.isArray(eft))eft=new Array();eft[fPMi-1]=str;}else if(fPM.length==1){aft=f.slice(0);eft=str;}else{}if(fPMi==0){hft=bhf();if(!isCond){if(xEq==0)hft='y = '+hft;else if(xEq==1)hft='x = '+hft;else if(xEq==4)hft='r = '+hft;}}}var dependancy=xDepend+(yDepend<<1)+(thetaDepend<<3);return {'hft': hft,'aft': aft,'eft': eft,'Errors': Errors,'depend': dependancy,'xEq': xEq,'hasPM': hasPM}};
    var brackets=function(){var b9=0,b0=0,bstart=0,bstarti,bendi;var started=0;var i,j,fn,temp;for(j=0;j<f.length;j++){fn=f[j];for(i=0;i<fn.length;i++){if(fn[i]=='('){b9++;if(bstart!=1){bstart=1;bstarti=i;}}else if(fn[i]==')'){b0++;if(b9==b0 && bstart==1){bendi=i;bstart=0;if(bendi==fn.length-1 && bstarti==0){   f[j]=fn.substr(bstarti+1,bendi-bstarti-1);j--;}else{temp=f.length;f[temp]=fn.substr(bstarti+1,bendi-bstarti-1);fInfo[temp]=1;f[j]=f[j].replace('('+f[temp]+')','f['+temp+']');}}}}}return 1;};var multiCorrect=function(){var multiCorrected=0;var flen=f.length;var dd,k,multii,tempm,multiCheck,multiTemp,multiChecki;var patt1=new Array();patt1[0] = /(x|y|\d+|f\[\d+\])(x|y|f\[\d+\])/g;patt1[1] = /(x|y|f\[\d+\])(x|y|\d+|f\[\d+\])/g;for(dd=0;dd<=1;dd++){var patt = patt1[dd];for(k=0;k<flen;k++){if(fInfo[k]==3)continue;while(f[k].match(patt)){multiTemp=f[k].match(patt);for(multii=0;multii<multiTemp.length;multii++){if(multiTemp.length==1 && multiTemp[0]==f[k])tempm=k;else tempm=f.length;multiCheck=multiTemp[multii].match(/f\[(\d+)\]/g);if(Array.isArray(multiCheck)){for(multiChecki=0;multiChecki<multiCheck.length;multiChecki++){multiCheck[multiChecki]=multiCheck[multiChecki].replace(/f\[(\d+)\]/g,'\$1');if(fInfo[multiCheck[multiChecki]]==2){multiCorrected=1;}}}f[tempm]=multiTemp[multii].replace(patt,'\$1*\$2');if(multiCorrected==1){for(multiChecki=0;multiChecki<multiCheck.length;multiChecki++){ var pattT='f['+multiCheck[multiChecki]+']';if(fInfo[multiCheck[multiChecki]]==2)f[tempm]=f[tempm].replace(pattT,f[multiCheck[multiChecki]]);}multiCorrected=0;}f[k]=f[k].replace(multiTemp[multii],'f['+tempm+']');fInfo[tempm]=2;}}}}return 1;};
    var bhf=function(){var fH=f.slice(0);var power=0;var pInfo=new Array();var patt=/f\[\d+\]/g;var fHi,child,chi;var humanFtmp;var patt1;for(fHi=0;fHi<fH.length;fHi++){if(fInfo[fHi]==0){if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=0;}}}else if(fInfo[fHi]==1){if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=1;}}}else if(fInfo[fHi]==2){if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=2;}}}else if(fInfo[fHi]==3){if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=3;}}}else if(fInfo[fHi]==4){patt1=/(sin|cos|tan|ln|log|round)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\$1\\left(\$2\\right)');}patt1=/(ain)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'arcsin\\left(\$2\\right)');}patt1=/(aos)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'arccos\\left(\$2\\right)');}patt1=/(aan)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'arctan\\left(\$2\\right)');}patt1=/(sih)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'sinh\\left(\$2\\right)');}patt1=/(coh)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'cosh\\left(\$2\\right)');}patt1=/(tah)f\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'tanh\\left(\$2\\right)');}patt1=/powf\((.*),(.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'{\$1}^{\$2}');power=1;}patt1=/absf\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\\left|{\$1}\\right|');}patt1=/floorf\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\\lfloor{\$1}\\rfloor');}patt1=/cilf\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\\lceil{\$1}\\rceil');}patt1=/sqrtf\((.*)\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\\sqrt{\$1}');}if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');if(power==1){pInfo[child[chi]]=9;power=0;}else {pInfo[child[chi]]=4;}}}}else if(fInfo[fHi]==5){patt1=/(.*)\/(.*)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\\frac{\$1}{\$2}');}if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=5;}}}else if(fInfo[fHi]==6){fH[fHi]='\\pi';}else if(fInfo[fHi]==7){fH[fHi]='e';}else if(fInfo[fHi]==8){patt1=/(min)f\(\[(.*)\]\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'\$1\\left(\$2\\right)');}patt1=/(maz)f\(\[(.*)\]\)/;if(patt1.test(fH[fHi])){fH[fHi]=fH[fHi].replace(patt1,'max\\left(\$2\\right)');}if(fH[fHi].match(patt)){child=fH[fHi].match(patt);for(chi=0;chi<child.length;chi++){child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');pInfo[child[chi]]=8;}}}else if(fInfo[fHi]==9){fH[fHi]='\\theta';}if(fHi==0)humanFtmp=fH[0];}patt=/f\[\d+\]/g;for(fHi=0;fHi<fH.length;fHi++){if(fH[fHi].match(patt)){child=fH[fHi].match(patt);if(fH[fHi]==child[0]){child[0]=child[0].replace(/f\[(\d+)\]/,'\$1');pInfo[child[0]]=pInfo[fHi];fInfo[fHi]=fInfo[child[0]];}}}patt=/f\[\d+\]/g;var humMi,humM;while(fH[0].match(patt)){humM=fH[0].match(patt);for(humMi=0;humMi<humM.length;humMi++){humM[humMi]=humM[humMi].replace(/f\[(\d+)\]/,'\$1');if((fInfo[humM[humMi]]==4 || fInfo[humM[humMi]]==5 || pInfo[humM[humMi]]==4 || pInfo[humM[humMi]]==8) && pInfo[humM[humMi]]!=9){fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);}else if(pInfo[humM[humMi]]==5 || fInfo[humM[humMi]]==3 || fInfo[humM[humMi]]==6 || fInfo[humM[humMi]]==7 || fInfo[humM[humMi]]==9 || fH[humM[humMi]]=='x' || fH[humM[humMi]]=='y' || fH[humM[humMi]]=='r'){fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);}else if(fInfo[humM[humMi]]==2 && pInfo[humM[humMi]]==2){fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);}else {fH[0]=fH[0].replace('f['+humM[humMi]+']','\\left('+fH[humM[humMi]]+'\\right)');}}}humanFtmp=fH[0].replace(/\*/g,'&sdot;').replace(/\+\-/g,'\\pm ');return humanFtmp;};
    var getFInfo=function(func,isCond){func=func.replace(/\s/g,'').toLowerCase();var Errors=new Array();var xEq;var patt1,patt2,pattS;var patt1=/(\(-?(\d*.?\d+|pi|p|e),-?(\d*.?\d+|pi|p|e)\),?)+/g;var table=func.match(patt1);if(Array.isArray(table) && table[0]==func)table=1;else table=0;if(table){return {'Errors': Errors, 'type': 1, 'func':func};}var patt1=/=/g;var eq=func.match(patt1);if(Array.isArray(eq))eq=1;else eq=0;if(eq){if(func[1]=='='){if(func[0]=='y')xEq=0;else if(func[0]=='x')xEq=1;else if(func[0]=='r')xEq=4;else Errors[Errors.length]=16;}else Errors[Errors.length]=16;func=func.substr(2);}else xEq=-1;if(isCond){pattS=/(sinh|cosh|tanh|arcsin|arccos|arctan|ceil|sin|cos|log|ln|tan|theta|θ|e|pi|p|π|sqrt|abs|floor|round|min|max|,|\.|\+|\-|\*|\/|\(|\)|\[|\]|\||\^|\d|x|y|r)/g;}else{pattS=/(sinh|cosh|tanh|arcsin|arccos|arctan|ceil|sin|cos|log|ln|tan|theta|θ|e|pi|p|π|sqrt|abs|floor|round|min|max|,|\.|\+|\-|\*|\/|\(|\)|\[|\]|\||\^|\d|x|y)/g;}var ErrTokenTemp=func.replace(pattS,' ').split(' ');var ErrToken=new Array();var ErrTno=0;var ErrTokenI;for(ErrTokenI=0;ErrTokenI<ErrTokenTemp.length;ErrTokenI++){if(ErrTokenTemp[ErrTokenI]!='')ErrToken[ErrTno]=ErrTokenTemp[ErrTokenI];}if(ErrToken.length>0)Errors[Errors.length]=2;var b9match,b0match,b9count,b0count;patt1=/\(/g;patt2=/\)/g;b9match=func.match(patt1);b0match=func.match(patt2);b9count=Array.isArray(b9match)?b9match.length:0;b0count=Array.isArray(b0match)?b0match.length:0;if(b9count!=b0count)Errors[Errors.length]=3;patt1=/\[/g;patt2=/\]/g;b9match=func.match(patt1);b0match=func.match(patt2);b9count=Array.isArray(b9match)?b9match.length:0;b0count=Array.isArray(b0match)?b0match.length:0;if(b9count!=b0count)Errors[Errors.length]=3;patt1=/\|/g;var ModMatch=func.match(patt1);var ModCount=Array.isArray(ModMatch)?ModMatch.length:0;if(ModCount%2)Errors[Errors.length]=4;else if(ModCount>2){patt1=/\(\|/g;patt2=/\|\)/g;var m9match=func.match(patt1);var m0match=func.match(patt2);var m9count=Array.isArray(m9match)?m9match.length:0;var m0count=Array.isArray(m0match)?m0match.length:0;if((m9count!=m0count) || (ModCount!=m9count+m0count))Errors[Errors.length]=5;}patt1=/\((\.|\*|\+|\-|\/|\^|\.)*\)/g;var EmptyB=func.match(patt1);if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=6;patt1=/\(?\|(\.|\*|\+|\-|\/|\^)*\|\)?/g;EmptyB=func.match(patt1);if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=7;patt1=/\[(\.|\*|\+|\-|\/|\^|\.)*\]/g;EmptyB=func.match(patt1);if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=14;patt1=/\.[^\d]/g;var unDot=func.match(patt1);var unDotCount=Array.isArray(unDot)?unDot.length:0;if(unDotCount)Errors[Errors.length]=8;var unPow,unPowCount;patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|\.|\+|\-|\*|\/|\(|\[|\^)\^/g;unPow=func.match(patt1);unPowCount=Array.isArray(unPow)?unPow.length:0;if(unPowCount)Errors[Errors.length]=9;patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|\+|\-|\*|\/|\^|\(|\[)(\+|\*|\/|\))[^\-]/g;patt2=/\)/g;unPow=func.match(patt1);unPowCount=Array.isArray(unPow)?unPow.length:0;if(unPowCount)Errors[Errors.length]=10;patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|min|max|\+|\-|\*|\/|\^|\(|\[)$/g;patt2=/\)/g;unPow=func.match(patt1);unPowCount=Array.isArray(unPow)?unPow.length:0;if(unPowCount)Errors[Errors.length]=11;patt1=/(min|max)[^\(]/g;patt2=/\)/g;unPow=func.match(patt1);unPowCount=Array.isArray(unPow)?unPow.length:0;if(unPowCount)Errors[Errors.length]=12;var exComCount=0;var strToPross=func;patt1=/(min|max)/g;var AllMinMax=strToPross.match(patt1);var minMaxFound=Array.isArray(AllMinMax)?AllMinMax.length:0;var i,startCheck,ignList;for(i=0;i<minMaxFound;i++){startCheck=strToPross.indexOf(AllMinMax[i])+4;ignList=0;for(j=startCheck;j<strToPross.length;j++){if(strToPross[j]=='('){ignList++;}else if(strToPross[j]==')'){if(ignList)ignList--;else strToPross=strToPross.substr(j+1);break;}else if(strToPross[j]==','){exComCount++;}}}patt1=/,/g;var unCom=func.match(patt1);var unComCount=Array.isArray(unCom)?unCom.length:0;if(unComCount!=exComCount)Errors[Errors.length]=13;func=func.replace('max','maz');patt1=/(\+\-)/;var hasPM=func.match(patt1);if(Array.isArray(hasPM))hasPM=1;else hasPM=0;patt1=/x/g;var xDepend=func.match(patt1);if(Array.isArray(xDepend))xDepend=1;else xDepend=0;patt1=/y/g;var yDepend=func.match(patt1);if(Array.isArray(yDepend))yDepend=1;else yDepend=0;patt1=/(theta|θ)/g;var thetaDepend=func.match(patt1);if(Array.isArray(thetaDepend))thetaDepend=1;else thetaDepend=0;if(xEq==-1){if(thetaDepend)xEq=4;else if(yDepend)xEq=1;else xEq=0;}if(thetaDepend && xDepend && yDepend && !isCond)Errors[Errors.length]=15;else if(xDepend && xEq!=0 && !isCond)Errors[Errors.length]=16;else if(yDepend && xEq!=1 && !isCond)Errors[Errors.length]=16;else if(thetaDepend && xEq!=4 && !isCond)Errors[Errors.length]=16;var type=0;if(thetaDepend)type=2;return {'Errors': Errors, 'type': type, 'xDepend': xDepend, 'yDepend': yDepend, 'thetaDepend': thetaDepend, 'xEq':xEq, 'func':func, 'hasPM': hasPM};};
    var sinf=function(v){if(td)v=Math.PI*(v/180);var ans = Math.sin(v);return ans;};var cosf=function(v){if(td)v=Math.PI*(v/180);var ans = Math.cos(v);return ans;};var tanf=function(v){if(td)v=Math.PI*(v/180);var ans = Math.tan(v);return ans;};var logf=function(v){var ans = Math.log(v)/Math.LN10;return ans;};var lnf=function(v){var ans = Math.log(v);return ans;};var sqrtf=function(v){var ans = Math.sqrt(v);return ans;};var powf=function(u,v){var ans = Math.pow(u,v);return ans;};var minf=function(u){if(!Array.isArray(u))return u;var ans=u[0];var i;for(i=1;i<u.length;i++){if(u[i]<ans)ans=u[i];}return ans;};var mazf=function(u){if(!Array.isArray(u))return u;var ans=u[0];var i;for(i=1;i<u.length;i++){if(u[i]>ans)ans=u[i];}return ans;};var absf=function(u){var ans = Math.abs(u);return ans;};var floorf=function(u){var ans = Math.floor(u);return ans;};var cilf=function(u){var ans = Math.ceil(u);return ans;};var roundf=function(u){var ans = Math.round(u);return ans;};var ainf=function(v){ var ans = Math.asin(v);if(td)ans*=(180/Math.PI);return ans;};var aosf=function(v){ var ans = Math.acos(v);if(td)ans*=(180/Math.PI);return ans;};var aanf=function(v){ var ans = Math.atan(v);if(td)ans*=(180/Math.PI);return ans;};var sihf=function(v){if(td)v=Math.PI*(v/180);var ans = (Math.exp(v)-Math.exp(-v))/2;return ans;};var cohf=function(v){if(td)v=Math.PI*(v/180);var ans = (Math.exp(v)+Math.exp(-v))/2;return ans;};var tahf=function(v){if(td)v=Math.PI*(v/180);var ans = (1-Math.exp(-2*v))/(1+Math.exp(-2*v));return ans;};var tdgt=function(no,to){var tdtmp=Math.abs(no).toPrecision(to);var toDP=(2*to)+1-tdtmp.toString().length;if(toDP>20 || toDP<1)return no.toPrecision(to);var toDig=no.toPrecision(toDP);return toDig;};var cH,cW,sX,sY,oX,oY,rXs,rXe,rYs,rYe;var zX=1;var zY=1;var sG=1;var sli=0;var sL=1;var sA=1;var tB=1;var cTr=1;var td=0;cH=500;cW=500;sX=64;sY=64;oX=cW/2;oY=cH/2;var setCan=function(){var c=document.getElementById('ugraph');var cHelp=document.getElementById('ugraphHelp');var oXm=oX/cW;var oYm=oY/cH;oX=cW*oXm;oY=cH*oYm;c.style.position='absolute';c.style.zIndex=0;cHelp.style.position='absolute';cHelp.style.zIndex=1;c.style.top='0px';cHelp.style.top='0px';c.style.left='0px';cHelp.style.left='0px';c.width=cW;c.height=cH;cHelp.width=cW;cHelp.height=cH;prg();};var prgh=function(){var c=document.getElementById('ugraphHelp');var ctx=c.getContext('2d');ctx.clearRect(0,0,cW,cH);};var prg=function(){prgh();var c=document.getElementById('ugraph');var ctx=c.getContext('2d');ctx.strokeStyle='black';ctx.fillStyle='black';ctx.clearRect(0,0,cW,cH);var textwidth,DX,DY,Xcoy,Ycox;ctx.font="10pt Georgia";var de="\u00a9 "+"N"+"isa"+"rg"+" Jh"+"ave"+"ri";textwidth=ctx.measureText(de).width;if(cH-oY<=20){DX=5;DY=15;}else {DX=cW-5-textwidth;DY=cH-5;}ctx.fillText(de,DX,DY);ctx.lineWidth=0.5;ctx.beginPath();if(oY>cH){Xcoy=cH;}else {Xcoy=oY;}if(sA){ctx.moveTo(0,Xcoy);ctx.lineTo(cW,Xcoy);ctx.stroke();}ctx.beginPath();if(oX>cW){Ycox=cW;}else {Ycox=oX;}if(sA){ctx.moveTo(Ycox,0);ctx.lineTo(Ycox,cH);ctx.stroke();}crtG();};
    var polarGrid=function(){};var crtG=function(){var c=document.getElementById('ugraph');var ctx=c.getContext('2d');ctx.strokeStyle='black';ctx.fillStyle='black';var partDivide;ctx.font="10pt Georgia";var nOfXCo=Math.floor(cW/sX);var lastxline=0;var textwidthmax=0;var xcoi,xCo,posX,skipX,partX,partXi,xCoy1,xCoy2,xtextY,Xstart,Xend,xCox,xCoxNext,partXCox,partXDno,partXDigit;for(xcoi=0;xcoi<=nOfXCo;xcoi++){xCo=xcoi-(Math.floor(oX/sX));textwidth=ctx.measureText(xCo).width;if(textwidth>textwidthmax)textwidthmax=textwidth;}if(oY<0){posX=3;}else if(cH-oY<0){posX=2;}else if(cH-oY<=20){posX=1;}else {posX=0;}skipX=Math.ceil((textwidthmax+40)/sX);partX=Math.floor(sX*skipX/20);if(partX%2==1 && partX>=2){partX++;}var repeatThis=0;var partXD;do{partXD=0;for(partDivide=1;partDivide<partX;partDivide++){if(partX%partDivide==0 && partDivide!=1 && partDivide!=2){partXD=partDivide;break;}}if(partXD>6){repeatThis=1;partX-=2;}else {repeatThis=0;}}while(repeatThis==1);xCoy1=oY;xCoy2=oY+5;if(posX==3){xCoy1=0;xCoy2=5;}else if(posX==2){xCoy1=cH;xCoy2=cH-5;}else if(posX==1){xCoy2=oY-5;}else {xCoy2=oY+5;}if(posX==2 || posX==1){xtextY=xCoy1-6;} else {xtextY=xCoy1+15;} rXs=-oX/sX;rXe=(cW-oX)/sX;Xstart=Math.floor(rXs);Xstart=Xstart-(Xstart%skipX)-skipX;Xend=Math.ceil(rXe);Xend=Xend+(Xend%skipX);for(xcoi=Xstart;xcoi<=Xend;xcoi+=skipX){xCo=xcoi;xCox=(xCo*sX)+oX;xCoxNext=((xCo+skipX)*sX)+oX;if((xCox<0 && xCoxNext<0) || xCox>cW)continue;if(xCox>=0){ctx.lineWidth=1;if(sli){ctx.beginPath();ctx.moveTo(xCox,xCoy1);ctx.lineTo(xCox,xCoy2);ctx.stroke();}if(sG){ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(xCox,0);ctx.lineTo(xCox,cH);ctx.stroke();}}ctx.lineWidth=0.5;if(partX>=2){for(partXi=0;partXi<partX-1;partXi++){partXCox=xCox+((partXi+1)*(sX*skipX/partX));if(partXCox<0 || partXCox>cW)continue;if((partXi+1)%partXD==0 && partXD!=0){partXDno=(partXi+1)/partXD;ctx.lineWidth=1;if(sli){ctx.beginPath();ctx.moveTo(partXCox,xCoy1);ctx.lineTo(partXCox,xCoy2);ctx.stroke();}if(sG){ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(partXCox,0);ctx.lineTo(partXCox,cH);ctx.stroke();}ctx.lineWidth=0.5;partXDigit=xCo+skipX*partXD*partXDno/partX;partXDigit=Math.round(partXDigit*1000)/1000;textwidth=ctx.measureText(partXDigit).width;if(sL)ctx.fillText(partXDigit,partXCox-(textwidth/2)-1,xtextY);}else{ctx.lineWidth=0.5;if(sli){ctx.beginPath();ctx.moveTo(partXCox,xCoy1);ctx.lineTo(partXCox,xCoy2);ctx.stroke();}if(sG){ctx.lineWidth=0.1;ctx.beginPath();ctx.moveTo(partXCox,0);ctx.lineTo(partXCox,cH);ctx.stroke();}}}}textwidth=ctx.measureText(xCo).width;if(sL)ctx.fillText(xCo,xCox-(textwidth/2)-1,xtextY);}ctx.font="10pt Georgia";var nOfYCo=Math.floor(cH/sY);var lastyline=0;var textwidthmax=0;var ycoi,yCo,posY,skipY,partY,partYi,yCoy1,yCoy2,ytextX,Ystart,Yend,yCox,yCoxPrev,partYCox,partYDno,partYDigit;for(ycoi=0;ycoi<=nOfYCo;ycoi++){yCo=ycoi-(Math.floor(oY/sY));textwidth=ctx.measureText(yCo).width;if(textwidth>textwidthmax)textwidthmax=textwidth;}if(oX>cW){posY=3;}else if(oX<0){posY=2;}else if(oX<=textwidthmax+5){posY=1;}else {posY=0;}skipY=Math.ceil((textwidthmax+40)/sY);partY=Math.floor(sY*skipY/20);if(partY%2==1 && partY>=2){partY++;}var repeatThis=0;var partYD;do{partYD=0;for(partDivide=1;partDivide<partY;partDivide++){if(partY%partDivide==0 && partDivide!=1 && partDivide!=2){partYD=partDivide;break;}}if(partYD>6){repeatThis=1;partY-=2;}else {repeatThis=0;}}while(repeatThis==1);yCoy1=oX;yCoy2=oX-5;if(posY==3){yCoy1=cW;yCoy2=cW-5;}else if(posY==2){yCoy1=0;yCoy2=5;}else if(posY==1){yCoy2=oX+5;}else {yCoy2=oX-5;}rYs=(oY-cH)/sY;rYe=oY/sY;Ystart=Math.floor(rYs);Ystart=Ystart-(Ystart%skipY)-skipY;Yend=Math.ceil(rYe);Yend=Yend+(Yend%skipY);for(ycoi=Ystart;ycoi<=Yend;ycoi+=skipY){yCo=ycoi;yCox=-(yCo*sY)+oY;yCoxPrev=-((yCo-skipY)*sY)+oY;if((yCox<0 && yCoxPrev<0) || yCox>cH)continue;ctx.lineWidth=1;if(sli){ctx.beginPath();ctx.moveTo(yCoy1,yCox);ctx.lineTo(yCoy2,yCox);ctx.stroke();}if(sG){ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(0,yCox);ctx.lineTo(cW,yCox);ctx.stroke();}ctx.lineWidth=0.5;if(partY>=2){for(partYi=0;partYi<partY-1;partYi++){partYCox=yCox+((partYi+1)*(sY*skipY/partY));if(partYCox<0 || partYCox>cH)continue;if((partYi+1)%partYD==0 && partYD!=0){partYDno=(partYi+1)/partYD;ctx.lineWidth=1;if(sli){ctx.beginPath();ctx.moveTo(yCoy1,partYCox);ctx.lineTo(yCoy2,partYCox);ctx.stroke();}if(sG){ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(0,partYCox);ctx.lineTo(cW,partYCox);ctx.stroke();}ctx.lineWidth=0.5;partYDigit=yCo-(skipY*partYD*partYDno/partY);partYDigit=Math.round(partYDigit*1000)/1000;textwidth=ctx.measureText(partYDigit).width;if(posY==2 || posY==1){ytextX=yCoy1+6;}else {ytextX=yCoy1-textwidth-6;}if(sL)ctx.fillText(partYDigit,ytextX,partYCox+5);}else {ctx.lineWidth=0.5;if(sli){ctx.beginPath();ctx.moveTo(yCoy1,partYCox);ctx.lineTo(yCoy2,partYCox);ctx.stroke();}if(sG){ctx.lineWidth=0.1;ctx.beginPath();ctx.moveTo(0,partYCox);ctx.lineTo(cW,partYCox);ctx.stroke();}}}}textwidth=ctx.measureText(yCo).width;if(posY==2 || posY==1){ytextX=yCoy1+6;}else {ytextX=yCoy1-textwidth-6;}if(sL)ctx.fillText(yCo,ytextX,yCox+5);}};var zoomAxis=function(zoom){if(zoom>0){if(zX)sX=sX*zoom;if(zY)sY=sY*zoom;}else if(zoom<0){if(zX)sX=sX/(-zoom);if(zY)sY=sY/(-zoom);}if(sX>65536)sX=65536;if(sY>65536)sY=65536;if(sX<0.125)sX=0.125;if(sY<0.125)sY=0.125;prg();plotFunc();};var resetAxis=function(){sX=64;sY=64;oX=cW/2;oY=cH/2;setCan();plotFunc();};var showAxisSet=function(mode){sA=Number(mode);prg();plotFunc();};var showGridSet=function(mode){sG=Number(mode);prg();plotFunc();};var showLabelSet=function(mode){sL=Number(mode);prg();plotFunc();};var showLabelInSet=function(mode){sli=Number(mode);prg();plotFunc();};var showTrackSet=function(mode){tB=Number(mode);prg();plotFunc();};var showCoTrackSet=function(mode){cTr=Number(mode);prg();plotFunc();};var trigRadSet=function(rad){td=parseInt(rad);var fI;for(fI=0;fI<exss.length;fI++){exss[fI].fAllVals=new Array();}prg();plotFunc();};var plotting=0;var isValidNo=function(x){return (x!=Number.POSITIVE_INFINITY) && (x!=Number.NEGATIVE_INFINITY) && (!isNaN(x));};
    var egy=function(fI,isPM,PMi,x){var xString=x.toString();var toEval;if(isPM){if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[PMi])!='undefined'){if(typeof(exss[fI].fAllVals[PMi][xString])!='undefined')return exss[fI].fAllVals[PMi][xString];}else exss[fI].fAllVals[PMi]=new Array();}else {exss[fI].fAllVals=new Array();exss[fI].fAllVals[PMi]=new Array();}toEval=exss[fI].evalF[PMi];}else {if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[xString])!='undefined')return exss[fI].fAllVals[xString];}else exss[fI].fAllVals=new Array();toEval=exss[fI].evalF;}try{eval(toEval);}catch(e){return '111er111';}var val=fEvalTmp[0];if(valc(fI,{'x':x,'y':val})==false)val=Number.NaN;if(isPM){exss[fI].fAllVals[PMi][xString]=val;}else {exss[fI].fAllVals[xString]=val;}return val;};var egx=function(fI,isPM,PMi,y){var yString=y.toString();var toEval;if(isPM){if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[PMi])!='undefined'){if(typeof(exss[fI].fAllVals[PMi][yString])!='undefined')return exss[fI].fAllVals[PMi][yString];}else exss[fI].fAllVals[PMi]=new Array();}else {exss[fI].fAllVals=new Array();exss[fI].fAllVals[PMi]=new Array();}toEval=exss[fI].evalF[PMi];}else {if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[yString])!='undefined')return exss[fI].fAllVals[yString];}else exss[fI].fAllVals=new Array();toEval=exss[fI].evalF;}try{eval(toEval);}catch(e){return '111er111';}var val=fEvalTmp[0];if(valc(fI,{'x':val,'y':y})==false)val=Number.NaN;if(isPM){exss[fI].fAllVals[PMi][yString]=val;}else {exss[fI].fAllVals[yString]=val;}return val;};var egr=function(fI,isPM,PMi,t){var tString=t.toString();var toEval;if(isPM){if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[PMi])!='undefined'){if(typeof(exss[fI].fAllVals[PMi][tString])!='undefined')return exss[fI].fAllVals[PMi][tString];}else exss[fI].fAllVals[PMi]=new Array();}else {exss[fI].fAllVals=new Array();exss[fI].fAllVals[PMi]=new Array();}toEval=exss[fI].evalF[PMi];}else {if(typeof(exss[fI].fAllVals)!='undefined'){if(typeof(exss[fI].fAllVals[tString])!='undefined')return exss[fI].fAllVals[tString];}else exss[fI].fAllVals=new Array();toEval=exss[fI].evalF;}try{theta=t;if(td)theta=theta*(180/Math.PI);eval(toEval);}catch(e){return '111er111';}var val=fEvalTmp[0];y=val*Math.sin(t);x=val*Math.cos(t);if(valc(fI,{'x':x,'y':y,'t':t,'r':val})==false)val=Number.NaN;if(isPM){exss[fI].fAllVals[PMi][tString]=val;}else {exss[fI].fAllVals[tString]=val;}return val;};var valc=function(fI,vals){var x=vals.x;var y=vals.y;if(typeof vals.t != 'undefined')theta=vals.t;if(typeof vals.r != 'undefined')r=vals.r;if(typeof(exss[fI].evalConds)=='undefined')return true;var condI;var tmpCondVals=new Array();for(condI=0;condI<exss[fI].evalConds.length;condI++){eval(exss[fI].evalConds[condI]);tmpCondVals[condI]=fEvalTmp[0];}var condSuccess=true;for(condI=0;condI<exss[fI].condMeta.length;condI++){if(eval('tmpCondVals['+exss[fI].condMeta[condI][0]+']'+exss[fI].condMeta[condI][1]+'tmpCondVals['+exss[fI].condMeta[condI][2]+']')==false)condSuccess=false;}return condSuccess;};
    var gD=function(data){var cAc,cAn,v1y,v2y;var maxY,minY,meX,meY,inc0,int1,dec0,dec1,inc,dec,yTemp,yTmpL;var icL,dcL,inI,inD,edI,edD,dCC,dCF;var dCC,inDir;var fI=data.fI;var x0=data.x0;var y0=data.y0;var x=data.x;var y=data.y;var x1=data.x1;var y1=data.y1;var x2=data.x2;var y2=data.y2;var X=data.X;var isPM=data.isPM;var pRi=data.pRi;var sX=data.sX;var getValFunc=data.getValFunc;var disconNext=data.disconNext;var disconSuspect=0;var vectX=1/sX;var vectXval=vectX*vectX;if(X && isValidNo(y0) && isValidNo(y) && isValidNo(y1) && isValidNo(y2)){v1y=y-y0;v2y=y1-y;cAc=(vectXval+(v1y*v2y))/Math.sqrt((vectXval+(v1y*v1y))*(vectXval+(v2y*v2y)));if(v1y>0){inc0=1;dec0=0;}else if(v1y<0){inc0=0;dec0=1;}else {inc0=0;dec0=0;}v1y=v2y;v2y=y2-y1;cAn=(vectXval+(v1y*v2y))/Math.sqrt((vectXval+(v1y*v1y))*(vectXval+(v2y*v2y)));if(v2y>0){inc1=1;dec1=0;}else if(v2y<0){inc1=0;dec1=1;}else {inc1=0;dec1=0;}if(cAc<0.25882 && cAn<0.25882){ disconSuspect=1;}else {disconNext=0;}}if(((isNaN(y) || isNaN(y1)) && (!isNaN(y) || !isNaN(y1))) || disconSuspect){if(disconSuspect)disconNext=1;maxY=y;minY=y;maxEndY=y1;meY=y1;var eps=(x1-x)/100;if(!disconSuspect){if(!isNaN(y)){yTemp=getValFunc(fI,isPM,pRi,x+eps);if(yTemp>y){inc0=1;dec0=0;}else if(yTemp<y){inc0=0;dec0=1;}else {inc0=0;dec0=0;}}else {yTemp=getValFunc(fI,isPM,pRi,x1-eps);if(y1>yTemp){inc1=1;dec1=0;}else if(y1<yTemp){inc1=0;dec1=1;}else {inc1=0;dec1=0;}}}yTemp=y;icL=inc0;dcL=dec0;inI=inc0;inD=dec0;edI=inc1;edD=dec1;inc=inc0;dec=dec0;dCC=0;dCF=0;var epsI;for(epsI=1;epsI<100;epsI++){yTmpL=yTemp;icL=inc;dcL=dec;yTemp=getValFunc(fI,isPM,pRi,x+(eps*epsI));if(isNaN(yTemp) || isNaN(yTmpL)){yTmpL=yTemp;continue;}if(disconSuspect){if((yTemp<y && yTemp>y1) || (yTemp>y && yTemp<y1)){disconNext=0;break;}}if(yTemp>yTmpL){inc=1;dec=0;}else if(yTemp<yTmpL){inc=0;dec=1;}else {inc=0;dec=0;}if(icL!=inc || dcL!=dec){dCC++;dCF=0;}else {dCF++;}if(!isNaN(y)){if(dCC==0){if(inI && yTemp>maxY){maxY=yTemp;}else if(inD && yTemp<minY){minY=yTemp;}}}if(!isNaN(y1)){if(dCF==0){maxEndY=y1;meY=y1;}else if(inc==edI && dec==edD){if(edI && yTemp<meY){meY=yTemp;}else if(edD&& yTemp>maxEndY){maxEndY=yTemp;}}}}if(isNaN(y) || isNaN(y1) || disconNext){if(inI)y=maxY;else if(inD)y=minY;if(edI)y1=meY;else if(edD)y1=maxEndY;}}return {'y': y,'y1': y1,'disconNext': disconNext}};
    var plotFunc=function(){plotting=1;var fI;for(fI=0;fI<exss.length;fI++){if(exss[fI].evalF!='000er000'){if(exss[fI].equal==0)pFx(fI);else if(exss[fI].equal==1)pFy(fI);else if(exss[fI].equal==2)pFt(fI);else if(exss[fI].equal==4)pFp(fI);}}plotting=0;return 1;};var pFx=function(fI){var c=document.getElementById('ugraph');var ctx=c.getContext('2d');var fColor=exss[fI].color;ctx.strokeStyle=fColor;ctx.lineWidth=2;var pR,pRi;if(Array.isArray(exss[fI].evalF)){pR=exss[fI].evalF.length;}else {pR=1;}var discon,disconNext,Yout,isPM;var isPM=pR-1;var x0,x,x1,x2,y0,y,y1,y2,X;for(pRi=0;pRi<pR;pRi++){ctx.beginPath();discon=0;disconNext=0;Yout=0;x1=(-oX)/sX;y1=egy(fI,isPM,pRi,x1);x2=(1-oX)/sX;y2=egy(fI,isPM,pRi,x2);for(X=0;X<=cW;X++){if(X){x0=x;y0=y;}x=x1;y=y1;x1=x2;y1=y2;x2=((X+2)-oX)/sX;y2=egy(fI,isPM,pRi,x2);if(disconNext)discon=1;var disconResult=gD({'fI': fI,'x0': x0,'y0': y0,'x': x,'y': y,'x1': x1,'y1': y1,'x2': x2,'y2': y2,'X': X,'isPM': isPM,'pRi': pRi,'sX': sX,'disconNext': disconNext,'getValFunc': egy});y=disconResult.y;y1=disconResult.y1;disconNext=disconResult.disconNext;if(y=='111er111'){return 0;break;}if(y==Number.POSITIVE_INFINITY){y=rYe+1;discon=1;}else if(y==Number.NEGATIVE_INFINITY){y=rYs-1;discon=1;}else if(isNaN(y)){discon=1;continue;}else if(y>rYe+1){y=rYe+1;if(Yout!=0)discon=1;else Yout=1;}else if(y<rYs-1){y=rYs-1;if(Yout!=0)discon=1;else Yout=1;}else Yout=0;Y=oY-(y*sY);if(X==0 || discon==1){if(isValidNo(Y))ctx.moveTo(X,Y);discon=0;}else {ctx.lineTo(X,Y);}}ctx.stroke();}};var pFy=function(fI){var c=document.getElementById('ugraph');var ctx=c.getContext('2d');var fColor=exss[fI].color;ctx.strokeStyle=fColor;ctx.lineWidth=2;var pR,pRi;if(Array.isArray(exss[fI].evalF)){pR=exss[fI].evalF.length;}else {pR=1;}var discon,disconNext,Xout,isPM;var isPM=pR-1;var x0,x,x1,x2,y0,y,y1,y2,X;for(pRi=0;pRi<pR;pRi++){ctx.beginPath();discon=0;disconNext=0;Xout=0;var cAc,cAn,vectY,vectYval,vect1X,vect2X;var maxX,minX,maxEndY,meY,inc0,int1,dec0,dec1,inc,dec,xTemp,xTempLast;var icL,dcL,inI,inD,edI,edD,dCC,dCF;var dCC,inDir;vectY=1/sY;vectYval=vectY*vectY;y1=oY/sY;x1=egx(fI,isPM,pRi,y1);y2=(oY-1)/sY;x2=egx(fI,isPM,pRi,y2);for(Y=0;Y<=cH;Y++){if(Y){x0=x;y0=y;}x=x1;y=y1;x1=x2;y1=y2;y2=(oY-(Y+2))/sY;x2=egx(fI,isPM,pRi,y2);if(disconNext)discon=1;disconSuspect=0;var disconResult=gD({'fI': fI,'x0': y0,'y0': x0,'x': y,'y': x,'x1': y1,'y1': x1,'x2': y2,'y2': x2,'X': Y,'isPM': isPM,'pRi': pRi,'sX': sY,'disconNext': disconNext,'getValFunc': egx});x=disconResult.y;x1=disconResult.y1;disconNext=disconResult.disconNext;if(x=='111er111'){return 0;break;}if(x==Number.POSITIVE_INFINITY){x=rYe+1;discon=1;}else if(x==Number.NEGATIVE_INFINITY){x=rYs-1;discon=1;}else if(isNaN(x)){discon=1;continue;}else if(x>rXe+1){x=rXe+1;if(Xout!=0)discon=1;else Xout=1;}else if(x<rXs-1){x=rXs-1;if(Xout!=0)discon=1;else Xout=1;}else Xout=0;X=oX+(x*sX);if(Y==0 || discon==1){ctx.moveTo(X,Y);discon=0;}else {ctx.lineTo(X,Y);}}ctx.stroke();}};var pFt=function(fI,mode){if(typeof mode == 'undefined')mode=0;var c=document.getElementById('ugraph');var ctx=c.getContext('2d');var fColor=exss[fI].color;ctx.strokeStyle=fColor;ctx.fillStyle=fColor;ctx.lineWidth=2;var X,Y,pointI;var pi=Math.PI;for(pointI=0;pointI<exss[fI].evalF.length;pointI++){x=exss[fI].evalF[pointI][0];y=exss[fI].evalF[pointI][1];X=oX+(x*sX);Y=oY-(y*sY);if(mode==1 && pointI){ctx.lineTo(X,Y);ctx.stroke();}ctx.beginPath();ctx.arc(X,Y,5,0,2*pi);ctx.fill();if(mode==1){ctx.beginPath();ctx.moveTo(X,Y);}}};var pFp=function(fI){var c=document.getElementById('ugraph');var ctx=c.getContext('2d');var fColor=exss[fI].color;ctx.strokeStyle=fColor;ctx.lineWidth=2;var pR,pRi;if(Array.isArray(exss[fI].evalF)){pR=exss[fI].evalF.length;}else {pR=1;}var discon,disconNext,Yout,isPM;var isPM=pR-1;var scaleTheta=1000;var t0,t,t1,t2,r0,r,r1,r2,T;var x,y,X,Y,Yout;for(pRi=0;pRi<pR;pRi++){ctx.beginPath();discon=0;disconNext=0;Yout=0;t1=0;r1=egr(fI,isPM,pRi,t1);t2=1/scaleTheta;r2=egr(fI,isPM,pRi,t2);var tLim=(2*Math.PI*scaleTheta);for(T=0;T<=tLim;T++){if(T){t0=t;r0=r;}t=t1;r=r1;t1=t2;r1=r2;t2=(T+2)/scaleTheta;r2=egr(fI,isPM,pRi,t2);if(disconNext)discon=1;var disconResult=gD({'fI': fI,'x0': t0,'y0': r0,'x': t,'y': r,'x1': t1,'y1': r1,'x2': t2,'y2': r2,'X': T,'isPM': isPM,'pRi': pRi,'sX': scaleTheta,'disconNext': disconNext,'getValFunc': egr});r=disconResult.y;r1=disconResult.y1;disconNext=disconResult.disconNext;y=r*Math.sin(t);x=r*Math.cos(t);X=(x*sX)+oX;if(y=='111er111'){return 0;break;}if(y==Number.POSITIVE_INFINITY){y=rYe+1;discon=1;}else if(y==Number.NEGATIVE_INFINITY){y=rYs-1;discon=1;}else if(isNaN(y)){discon=1;continue;}else if(y>rYe+1){if(Yout!=0)discon=1;else Yout=1;}else if(y<rYs-1){if(Yout!=0)discon=1;else Yout=1;}else Yout=0;Y=oY-(y*sY);if(X==0 || discon==1){if(isValidNo(Y))ctx.moveTo(X,Y);discon=0;}else {ctx.lineTo(X,Y);}}ctx.stroke();}};
    var canXorig,canYorig,canXend,canYend,origXorig,origYorig,canX,canY;var canvasMdown=function(ev){if(ev.button!=0)return;var c=document.getElementById('ugraphHelp');var rect=c.getBoundingClientRect();origXorig=oX;origYorig=oY;canXorig=ev.clientX-rect.left;canYorig=ev.clientY-rect.top;c.addEventListener('mousemove',canvasMmove,true);c.addEventListener('mouseup',canvasMup,false);c.addEventListener('mouseout',canvasMup,false);};var canvasMmove=function(ev){var c=document.getElementById('ugraphHelp');var rect=c.getBoundingClientRect();canXend=ev.clientX-rect.left;canYend=ev.clientY-rect.top;oX=origXorig+canXend-canXorig;oY=origYorig+canYend-canYorig;prg();plotFunc();};var canvasMup=function(ev){var c=document.getElementById('ugraphHelp');var rect=c.getBoundingClientRect();canXend=ev.clientX-rect.left;canYend=ev.clientY-rect.top;c.removeEventListener('mousemove',canvasMmove,true);c.removeEventListener('mouseup',canvasMup,false);c.removeEventListener('mouseout',canvasMup,false);oX=origXorig+canXend-canXorig;oY=origYorig+canYend-canYorig;prg();plotFunc();};var canvasMover=function(ev){var c=document.getElementById('ugraphHelp');c.addEventListener('mousewheel',canvasMscroll,false);c.addEventListener('DOMMouseScroll',canvasMscroll,false);c.addEventListener('mousemove',canvasMUpmove,true);c.addEventListener('mouseout',canvasMout,true);};var canvasMUpmove=function(ev){if(plotting)return 0;var c=document.getElementById('ugraphHelp');var ctx=c.getContext('2d');var rect=c.getBoundingClientRect();canX=ev.clientX-rect.left;canY=ev.clientY-rect.top;ctx.clearRect(0,0,cW,cH);if(tB){var fI,pR,isPM,pRi,Y,y,xT,X,x,yT;for(fI=0;fI<exss.length;fI++){if(exss[fI].evalF!='000er000'){var fColor=exss[fI].color;ctx.fillStyle=fColor;if(Array.isArray(exss[fI].evalF)){pR=exss[fI].evalF.length;}else {pR=1;}isPM=pR-1;for(pRi=0;pRi<pR;pRi++){if(exss[fI].equal==0){ctx.beginPath();X=canX;x=(X-oX)/sX;yT=egy(fI,isPM,pRi,x);if(yT=='111er111'){return 0;break;}if(!(yT==Number.POSITIVE_INFINITY || yT==Number.NEGATIVE_INFINITY || isNaN(yT) || yT>rYe+1 || yT<rYs-1)){Y=oY-(yT*sY);ctx.arc(X,Y,5,0,2*Math.PI);ctx.fill();}}else if(exss[fI].equal==1){ctx.beginPath();Y=canY;y=(oY-Y)/sY;xT=egx(fI,isPM,pRi,y);if(xT=='111er111'){return 0;break;}if(!(xT==Number.POSITIVE_INFINITY || xT==Number.NEGATIVE_INFINITY || isNaN(xT) || xT>rYe+1 || xT<rYs-1)){X=oX+(xT*sX);ctx.arc(X,Y,5,0,2*Math.PI);ctx.fill();}}}}}ctx.strokeStyle='blue';}if(cTr){var fI,y,nFactor,X,x,origFillStyle,fColor,leftMarg;y=new Array();for(fI=0;fI<exss.length;fI++){if(Array.isArray(exss[fI].evalF))return 0;}for(fI=0;fI<exss.length;fI++){if(exss[fI].equal)return 0;}nFactor=0;var nonEmptyF=new Array();X=canX;x=(X-oX)/sX;for(fI=0;fI<exss.length;fI++){if(exss[fI].evalF!='000er000'){y[fI]=egy(fI,0,0,x);if(y[fI]=='111er111')return 0;if(isNaN(y[fI]))y[fI]='Undefined';else y[fI]=tdgt(y[fI],6);nonEmptyF[nFactor]=fI;nFactor++;}else{y[fI]="";}}x=tdgt(x,6);if(!nFactor)return 0;if((nFactor*20)>cH)return 0;origFillStyle=ctx.fillStyle;ctx.fillStyle='white';ctx.fillRect(cW-171,1,171,(nFactor*20)+1);ctx.fillStyle=origFillStyle;ctx.lineWidth=0.2;ctx.beginPath();ctx.moveTo(cW-170,0);ctx.lineTo(cW-170,nFactor*20);ctx.moveTo(cW-90,0);ctx.lineTo(cW-90,nFactor*20);ctx.moveTo(cW-170,nFactor*20);ctx.lineTo(cW-90,nFactor*20);ctx.stroke();ctx.font="10pt Georgia";ctx.fillStyle='blue';ctx.fillText('x: '+x,cW-165,(nFactor*10)+3);ctx.fillStyle='black';for(fI=0;fI<nFactor;fI++){ctx.beginPath();ctx.moveTo(cW-90,(fI+1)*20);ctx.lineTo(cW,(fI+1)*20);ctx.stroke();ctx.font="10pt Georgia";var fColor=exss[nonEmptyF[fI]].color;ctx.fillStyle=fColor;ctx.fillText('y',cW-85,((fI+1)*20)-7);leftMarg=ctx.measureText('y').width-1;ctx.font="8pt Georgia";ctx.textBaseline="bottom";ctx.fillText(nonEmptyF[fI]+1,cW-85+leftMarg,((fI+1)*20)-2);leftMarg+=ctx.measureText(nonEmptyF[fI]+1).width;ctx.font="10pt Georgia";ctx.textBaseline="alphabetic";ctx.fillText(': '+y[nonEmptyF[fI]],cW-85+leftMarg+1,((fI+1)*20)-7);ctx.fillStyle='black';}}};var canvasMscroll=function(ev){ev.preventDefault();if(ev.wheelDelta)zoomScroll=-ev.wheelDelta;else zoomScroll=ev.detail*40;var zoom=zoomScroll/90;zoomAxis(zoom);};var canvasMout=function(ev){var c=document.getElementById('ugraphHelp');c.removeEventListener('mousewheel',canvasMscroll,false);c.removeEventListener('DOMMouseScroll',canvasMscroll,false);c.removeEventListener('mousemove',canvasMUpmove,true);c.removeEventListener('mouseout',canvasMout,true);prgh();};
    var getBestColor=function(){var minUsed=fcu[0];var minUsedId=0;var gbcI;for(gbcI=0;gbcI<fcl.length;gbcI++){if(fcu[gbcI]<minUsed){minUsed=fcu[gbcI];minUsedId=gbcI;}}fcu[minUsedId]++;return minUsedId;};var setColor=function(index, color){if(fcl.indexOf(exss[index].color) > -1)fcu[fcl.indexOf(exss[index].color)]--;if(fcl.indexOf(color) > -1)fcu[color]++;exss[index].color=color;prg();plotFunc();};
    
    this.getFile = function(){
        var graph={
            'Settings': {
                'zoomX': zX,
                'zoomY': zY,
                'showGrid': sG,
                'showLabelIndecator': sli,
                'showLabel': sL,
                'showAxis': sA,
                'trackBall': tB,
                'coTracker': cTr,
                'trigDegree': td,
                'cH': cH,
                'cW': cW,
                'scaleX': sX,
                'scaleY': sY,
                'origX': oX,
                'origY': oY
            },
            'Expressions': new Array()
        }
        var i;
        for(i=0;i<exss.length;i++){
            graph.Expressions.push({
                'val': exss[i].value,
                'color': exss[i].color,
            });
        }
        return JSON.stringify(graph);
    }
    var refreshGraph = function(){
        exss=new Array();
        fEvalTmp=new Array();
        setCan();
        $('#sidebar').empty();
    }
    this.openFile = function(file){
        var graphJson;
        try {
            graphJson=JSON.parse(file);
        }
        catch(e){
            return false;
        }
        var error=false,i;
        var exprs=graphJson.Expressions;
        if(!exprs)error=true;
        if(!error){
            for(i=0;!error && i<exprs.length;i++){
                if(typeof exprs[i].val == 'undefined'){
                    exprs[i].val = ''
                }
            }
        }
        if(error)return false;
        refreshGraph();
        for(i=0;!error && i<exprs.length;i++){
            var id = addF();
            exss[id]={
                color:exprs[id].color,
            }
            whfc(exprs[id].val,id);
            $('#expr'+id).val(exprs[i].val).blur();
        }
        $('.expr-in').last().show().focus();
        prg();
        plotFunc();
        return true;
    }
    var formatMenu=function(id){
        return [
            {
                type: 'main',
                id: 'expr',
                title: 'Expression', 
                icon: 'fa-gear', 
                groups: [
                    {
                        type: 'group',
                        id: 'color',
                        items: [
                            {
                                type: 'color',
                                text: 'C',
                                icon: 'fa-circle',
                                id: id,
                                title: 'Color',
                                currState: exss[id].color,
                                callback: setColor
                            },
                        ]
                    },
                    {
                        type: 'group',
                        id: 'remove',
                        items: [
                            {
                                type: 'button',
                                icon: 'fa-times',
                                id: id,
                                title: 'Remove exss',
                                callback: remF
                            },
                        ]
                    },
                ]
            }
        ];
    }
    
    var addF=function(){        
        var expr=$('<div class="expr">').appendTo('#sidebar');
        var id=exss.length;
        var sno=$('<div class="expr-no">'+(parseInt(id)+1)+'</div>').appendTo(expr);
        var input=$('<input class="expr-in" id="expr'+id+'">').appendTo(expr);
        var display=$('<div class="expr-dis" id="exprDis'+id+'"></div>').appendTo(expr).hide();
        display.mousedown(function(ev){
            var id=$(this).attr('id').substr(7);
            $(this).hide();
            $('#expr'+id).show();
            $('#expr'+id).focus();
            ev.preventDefault();
        });
        exss[id]={};
        exss[id].color=fcl[getBestColor()];
        whfc('',id);
        input.change(function(ev){
            var id=$(this).attr('id').substr(4);
            exss[id]={
                color:exss[id].color,
            }
            whfc($(this).val(),id);
            var add=1;
            for(var i=0;i<exss.length;i++){
                if(exss[i].evalF=='000er000'){
                    add=0;
                }
            }
            if(add)addF();
            prg();
            plotFunc();
        });
        
        input.focus(function(ev){
            var id=$(this).attr('id').substr(4);
            
            $('#exprDis'+id).hide();
            $(this).show();
            
            $('.expr.active').removeClass('active');
            $(this).closest('.expr').addClass('active');
            Base.updateMenu(defaultMenu.concat(formatMenu(id)));
        });
        
        input.blur(function(ev){
            var id=$(this).attr('id').substr(4);
            if( exss[id] && exss[id].humanF ){
                $(this).hide();
                $('#exprDis'+id).html('<span class="math">$'+exss[id].humanF+'$</span>');
                $('#exprDis'+id).show();
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#exprDis'+id).get(0)]);
            }
        });
        
        input.focus();
        return id;
    }
    
    var remF=function(id){
        
        if(fcl.indexOf(exss[id].color) > -1)
            fcu[fcl.indexOf(exss[id].color)]--;
        exss.splice(id,1);
        $('.expr').eq(id).remove();
        $('.expr').each(function(i){
            $(this).find('.expr-in').attr('id','expr'+i);
            $(this).find('.expr-dis').attr('id','exprDis'+i);
            $(this).find('.expr-no').text(i+1);
        });
        if($('.expr').eq(id).length){
            $('.expr .expr-in').eq(id).show();
            $('.expr .expr-in').eq(id).focus();
        }
        else {
            $('.expr .expr-in').eq(id-1).show();
            $('.expr .expr-in').eq(id-1).focus();
        }
        if(!$('.expr').length)
            addF();
        
        
        prg()
        plotFunc();
    }
    
    var axisToZoom=function(mode,onoff){
        if(onoff==false)return;
        if(mode=='both'){
            zX=1;
            zY=1;
        }
        else if(mode=='x'){
            zX=1;
            zY=0;
        }
        else if(mode=='y'){
            zX=0;
            zY=1;
        }
    }
    
    var settingsDom = false;
    var closeSettings = function(){
        if(settingsDom)
            settingsDom.detach()
    }
    var openSettings = function(){
        var modal = $(Base.openModal(null, null, closeSettings));
        $('<div id="setHead" class="setHead">Settings</div>').appendTo(modal);
        if( settingsDom ){
            settingsDom.appendTo(modal);
        }
        else {
            settingsDom = $('<div class="setSubTopic">')
                .append($('<div class="setSubHead" id="label_paper">Graph Paper</div>'))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox" checked>').bind('change', function(){showAxisSet(this.checked);}))
                    .append($('<span id="label_axis">Show Axis</span>')))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox" checked>').bind('change', function(){showGridSet(this.checked);}))
                    .append($('<span id="label_grid">Show Grid Lines</span>')))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox" checked>').bind('change', function(){showLabelSet(this.checked);}))
                    .append($('<span id="label_label">Show Label</span>')))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox">').bind('change', function(){showLabelInSet(this.checked);}))
                    .append($('<span id="label_indicator">Show Label Position Indicator</span>')))
                .append($('<div class="setSubHead" id="label_graph">Graph</div>'))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox" checked>').bind('change', function(){showTrackSet(this.checked);}))
                    .append($('<span id="label_trackball">Show Trackball</span>')))
                .append($('<span class="setSub">')
                    .append($('<input type="checkbox" checked>').bind('change', function(){showCoTrackSet(this.checked);}))
                    .append($('<span id="label_trackball">Show Coordinate Tracker</span>')))
                .append($('<div class="setSubHead" id="label_trigo">Trigo</div>'))
                .append($('<span class="setSub">')
                    .append($('<input type="radio" name="radDeg" checked>').bind('change', function(){trigRadSet(0);}))
                    .append($('<span id="label_rad">Radian</span>'))
                    .append($('<input type="radio" name="radDeg">').bind('change', function(){trigRadSet(1);}))
                    .append($('<span id="label_deg">Degree</span>')))
                .append($('<div id="setDone">')
                    .append($('<input type="button" id="setDoneButton" value="Done" class="button" />')).bind('click',Base.closeModal))
                .appendTo(modal);
        }
    }
    
    var graphParent;
    var editable;
    
    this.depends = ['MathJax'];
    this.init=function(parent, file){
        
        var side = $('<div class="sidebar" id="sidebar"></div>').appendTo(parent);
        
        graphParent=$('<div id="graphContain">').appendTo(parent);
        $('<canvas id="ugraph">Your browser does not support the HTML5 canvas tag.</canvas>').appendTo(graphParent);
        var can=$('<canvas id="ugraphHelp" ></canvas>').appendTo(graphParent);
        can.mousedown(canvasMdown);
        can.mouseover(canvasMover);
        
        graphParent.bind('click',function(){
            $('.expr.active').removeClass('active');
            Base.updateMenu(defaultMenu);
            Base.focusMenu('settings');
            
        });
        
        $(window).bind('keydown', function(ev){
            if((ev.keyCode==9 && event.shiftKey) || ev.keyCode==38){
                var focus = $('.expr.active').index() - 1;
                if(focus >= 0){
                    $('.expr-in').eq(focus).show().focus();
                }
                else {
                    $('.expr-in').last().show().focus();
                }
                ev.preventDefault();
            }
            else if(ev.keyCode==9 || ev.keyCode==40 || ev.keyCode==13){
                var focus = $('.expr.active').index() + 1;
                if(focus < $('.expr').length){
                    $('.expr-in').eq(focus).show().focus();
                }
                else {
                    if((focus == $('.expr').length) && ($('.expr-in').last().val()!=''))
                        addF();
                }
                ev.preventDefault();
            }
            else if(ev.keyCode==13){
                var focus = $('.expr.active').index() + 1;
                if(focus < $('.expr').length){
                    $('.expr-in').eq(focus).show().focus();
                }
                else {
                    if((focus == $('.expr').length) && ($('.expr-in').last().val()!=''))
                        addF();
                }
                ev.preventDefault();
            }
        });
        
        editable=$(parent);
        if( file && this.openFile(file) ){
            
        }
        else {
            addF();
        }
        
        this.resize();
    }
    
    var defaultMenu = [
        {
            type: 'main',
            id: 'settings',
            title: 'Graph', 
            icon: 'fa-gears', 
            groups: [
                {
                    type: 'group',
                    id: 'zoom',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-search-plus',
                            id: '1.5',
                            title: 'Zoom in',
                            callback: zoomAxis
                        },
                        {
                            type: 'button',
                            icon: 'fa-search-minus',
                            id: '-1.5',
                            title: 'Zoom out',
                            callback: zoomAxis
                        },
                        {
                            type: 'button',
                            icon: 'fa-undo',
                            id: 'reset',
                            title: 'Reset zoom and origin',
                            callback: resetAxis
                        },
                    ]
                },
                {
                    type: 'group',
                    id: 'axis',
                    required: true,
                    multiple: false,
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-arrows',
                            id: 'both',
                            title: 'Zoom in both axis',
                            onoff: true,
                            currState: true,
                            callback: axisToZoom
                        },
                        {
                            type: 'button',
                            icon: 'fa-arrows-h',
                            id: 'x',
                            title: 'Zoom in horizontal axis',
                            onoff: true,
                            callback: axisToZoom
                        },
                        {
                            type: 'button',
                            icon: 'fa-arrows-v',
                            id: 'y',
                            title: 'Zoom in vertical axis',
                            onoff: true,
                            callback: axisToZoom
                        },
                    ]
                },
                {
                    type: 'group',
                    id: 'settings',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-gear',
                            id: 'set',
                            title: 'More settings',
                            callback: openSettings
                        },
                    ]
                },
                {
                    type: 'group',
                    id: 'new',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-plus',
                            id: 'add',
                            title: 'Add expression',
                            callback: addF
                        },
                    ]
                },
            ]
        },
    ];
    this.getMenu=function(){
        return defaultMenu;
    }
    
    this.resize=function(){
        graphParent.width(editable.innerWidth()-$('#sidebar').outerWidth());
        var oXm=oX/cW;
        var oYm=oY/cH;
        cW=graphParent.innerWidth();
        cH=graphParent.innerHeight();
        oX=cW*oXm;
        oY=cH*oYm;
        setCan();
        prg();
        plotFunc();
    }
    
})();

module=Aalekhan;
