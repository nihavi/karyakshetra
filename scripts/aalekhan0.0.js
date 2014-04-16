/*
 * aalekhan0.0.js
 * 
 * Copyright 2014 Nisarg Jhaveri <nisargjhaveri@gmail.com>
 * 
 */
var Aalekhan = new (function(){
    var fColorList=new Array();
    fColorList[0]='#1859a9';
    fColorList[1]='#ed2d2e';
    fColorList[2]='#008c47';
    fColorList[3]='#562d76';
    fColorList[4]='#f16f06';
    fColorList[5]='#b64482';
    fColorList[6]='#40e89d';
    fColorList[7]='#ff00ff';
    var fColorUsed=new Array();
    fColorUsed[0]=0;
    fColorUsed[1]=0;
    fColorUsed[2]=0;
    fColorUsed[3]=0;
    fColorUsed[4]=0;
    fColorUsed[5]=0;
    fColorUsed[6]=0;
    fColorUsed[7]=0;
    
    var expression=new Array();
    /*{
        fAll: Array,
        conds: Array,
        condMeta:
        humanF: Array,
        humanConds:
        humanCondToShow:
        evalF:
        evalConds:
        fAllVals:
        errCode:
        color:
        depend:
        equal:
    }*/
    
    var fEvalTmp=new Array();
    var f,fInfo;
    var fReady=0;
    var functionListOld=new Array();
    var functionListNew=new Array();
    
    /* depend Help 
     * 0-->Independent
     * 1-->x dependent
     * 2-->y dependent
     * 4-->is Table
     */
    /* equal Help
     * 0-->x=something
     * 1-->y=something
     * 2-->is Table
     */
    /* fInfo Help
     * 0-->Original function
     * 1-->bracketed
     * 2-->multi corrected
     * 3-->non-nagative Constants
     * 4-->sin,cos,tan,log,ln,sqrt,pow,abs,floor,ceil,arcsin,arccos,arctan,sinh,cosh,tanh,round
     * 5-->Prioritize 1/x
     * 6-->PI
     * 7-->e
     * 8-->min,max(maz)
     * 9-->theta
     * 10-->r //Only in conditions
     */
    
    //1. For Evaluating Function
    var wholeHumanFunctionControll=function(func,fI){
        //Sets all global variable for the expression
        func=func.replace(/\s/g,'').toLowerCase();
        if(!expression[fI])expression[fI]=new Object();
        expression[fI].errCode=new Array();
        
        var condAll=func.split(';');
        
        if(condAll.length>1){
            //If any conditions are given
            expression[fI].conds=new Array();
            expression[fI].humanConds=new Array();
            expression[fI].evalConds=new Array();
            expression[fI].humanCondToShow=new Array();
            expression[fI].condMeta=new Array();
            expression[fI].humanCondToShow[condI]='';
            
            var condI;
            for(condI=1;condI<condAll.length;condI++){              
                var evaluatedCond=evalHumanCondition(condAll[condI], expression[fI].conds.length);
                
                expression[fI].conds=expression[fI].conds.concat(evaluatedCond.fAllCondsThis);
                expression[fI].humanConds=expression[fI].humanConds.concat(evaluatedCond.humanCondsThis);
                expression[fI].evalConds=expression[fI].evalConds.concat(evaluatedCond.evalCondsThis);
                expression[fI].humanCondToShow[condI-1]=evaluatedCond.humanCondToShowThis;
                expression[fI].condMeta=expression[fI].condMeta.concat(evaluatedCond.condMetaThis);
                if(evaluatedCond.Errors)expression[fI].errCode=expression[fI].errCode.concat(evaluatedCond.Errors);
            }
        }
        //Condition evaluation done
            
        //For the main function 
        var evaluatedFn=evalHumanFunction(condAll[0],false);
        if(evaluatedFn==false){
            expression[fI].errCode[0]=0;
            expression[fI].humanF='';
            expression[fI].evalF='000er000';
            fReady=0;
            expression[fI].depend=0;
            expression[fI].equal=0;
            return false;
        }
        else if(evaluatedFn.depend==4 && condAll.length>1){ //is Table
            expression[fI].errCode.push(20);
        }
        expression[fI].humanF=evaluatedFn.humanFThis;
        expression[fI].fAll=evaluatedFn.allFinThis;
        expression[fI].evalF=evaluatedFn.evalFinThis;
        if(evaluatedFn.Errors)expression[fI].errCode=expression[fI].errCode.concat(evaluatedFn.Errors);
        expression[fI].depend=evaluatedFn.depend;
        expression[fI].equal=evaluatedFn.xEq;
        //Main function evaluation done
        
        if(typeof(expression[fI].conds)!='undefined'){
            expression[fI].humanF=expression[fI].humanF+' ; '+expression[fI].humanCondToShow.join(' ; ');
        }
        expression[fI].errCode=expression[fI].errCode.filter(function(val, index, arr){
            return arr.indexOf(val) == index;
        });
        if(expression[fI].errCode.length && expression[fI].errCode[0]!=0){
            expression[fI].evalF='000er000';
        }
        //mainFunctionControll(func,fI);
    }
    
    
    var evalHumanCondition=function(cond,condBaseNo){
        //condBaseNo is the index of last condition in global array
        var getCondInfoOut=getCondInfo(cond);
        var Errors=getCondInfoOut.Errors;
        var patt1=/(<=|>=|!=|<|>|=)/g;
        var subConds=cond.split(patt1);
        var condItmp;
        var humanCondsThis=new Array();
        var humanCondToShowThis='';
        var evalCondsThis=new Array();
        var fAllCondsThis=new Array();
        var condMetaThis=new Array();//With reference to global serial no(condBaseNo)
        var lastCondI,currCondI;
        var latexSym={
            '=': '= ',
            '<': '\\lt ',
            '>': '\\gt ',
            '<=': '\\le ',
            '>=': '\\ge ',
            '!=': '\\ne '
        }
        var condItmp;
        for(condItmp=0;condItmp<subConds.length;condItmp++){
            if(condItmp&1){
                humanCondToShowThis+=latexSym[subConds[condItmp]];
                if(subConds[condItmp]=="=")subConds[condItmp]="==";
                continue;
            }
            var evaluatedFn=evalHumanFunction(subConds[condItmp],true);
            if(evaluatedFn==false){
                Errors.push(17);
            }
            else if(evaluatedFn.hasPM){
                Errors.push(18);
            }
            
            if(evaluatedFn.Errors)Errors=Errors.concat(evaluatedFn.Errors);
            currCondI=fAllCondsThis.push(evaluatedFn.allFinThis);//////////
            humanCondsThis.push(evaluatedFn.humanFThis);
            humanCondToShowThis+=evaluatedFn.humanFThis;
            evalCondsThis.push(evaluatedFn.evalFinThis);
            
            if(condItmp){
                condMetaThis.push(new Array(lastCondI+condBaseNo-1, subConds[condItmp-1], currCondI+condBaseNo-1));
            }
            lastCondI=currCondI;
        }
        return {
            'fAllCondsThis': fAllCondsThis,
            'evalCondsThis': evalCondsThis,
            'condMetaThis': condMetaThis,
            'humanCondsThis': humanCondsThis,
            'humanCondToShowThis': humanCondToShowThis,
            'Errors': Errors
        };
    }
    
    var getCondInfo=function(cond){
        cond=cond.replace(/\s/g,'').toLowerCase();
        var Errors=new Array();
        
        //For equality in condition
        patt1=/[^<>!]=/g;
        var condErr=cond.match(patt1);
        if(Array.isArray(condErr)){
            Errors.push(19);
        }
        //For equality in condition
        
        //For two comparator together
        var patt1=/(<=|>=|!=|=)(<=|>=|!=|<|>|=)/g;
        var condErr=cond.match(patt1);
        if(Array.isArray(condErr)){
            Errors.push(17);
        }
        var patt1=/(<|>|=)(<=|>=|!=|<|>)/g;
        var condErr=cond.match(patt1);
        if(Array.isArray(condErr)){
            Errors.push(17);
        }
        //For two comparator together
        //For comparator at start or end
        var patt1=/^(<=|>=|!=|<|>|=)/g;
        var condErr=cond.match(patt1);
        if(Array.isArray(condErr)){
            Errors.push(17);
        }
        var patt1=/(<=|>=|!=|<|>|=)$/g;
        var condErr=cond.match(patt1);
        if(Array.isArray(condErr)){
            Errors.push(17);
        }
        //For comparator at start or end
        //For unbalanced condition
        var patt1=/(<=|>=|!=|<|>|=)/g;
        var subConds=cond.split(patt1);
        if(!subConds.length&1 || subConds.length < 2){
            Errors.push(17);
        }
        //For unbalanced condition
        
        return {'Errors': Errors};
    }
    
    var evalHumanTable=function(getFInfoOut){
        var func=getFInfoOut.func;
        var Errors=getFInfoOut.Errors;
        var humanFThis='';
        var allFinThis=new Array();
        
        /*func=func.replace(/(pi|p)/g,Math.PI);
        func=func.replace(/e/g,Math.E);*/
        var patt=/(\((-?(\d*.?\d+|pi|p|π|e)),(-?(\d*.?\d+|pi|p|π|e))\))/g;
        var pairs=func.match(patt);
        if(Array.isArray(pairs)){
            var tableI;
            var pairX,pairY,humanX,humanY;
            var patt=/\((-?(\d*.?\d+|pi|p|π|e)),(-?(\d*.?\d+|pi|p|π|e))\)/g;
            for(tableI=0;tableI<pairs.length;tableI++){
                pairX=pairs[tableI].replace(patt,'\$1');
                pairY=pairs[tableI].replace(patt,'\$3');
                humanX=pairX;
                humanX=humanX.replace(/(pi|p)/g,'\\pi');
                humanY=pairY;
                humanY=humanY.replace(/(pi|p)/g,'\\pi');
                
                pairX=pairX.replace(/(pi|p)/g,Math.PI);
                pairX=pairX.replace(/e/g,Math.E);
                pairY=pairY.replace(/(pi|p)/g,Math.PI);
                pairY=pairY.replace(/e/g,Math.E);
                
                allFinThis.push([pairX,pairY]);
                if(tableI)humanFThis+=',';
                humanFThis+='\\left('+humanX+','+humanY+'\\right)';
            }
        }
        var evalFinThis=allFinThis.slice();
        return {
            'humanFThis': humanFThis,
            'allFinThis': allFinThis,
            'evalFinThis': evalFinThis,
            'Errors': Errors,
            'depend': 4,
            'xEq': 2
        }
    }
    
    var evalHumanFunction=function(func,isCond){
        //Requires global variables f, fInfo
        if(func==''){
            f='';fInfo='';
            return false;
        }
        f=new Array();
        fInfo=new Array();
        var allFinThis;
        var evalFinThis;
        var humanFThis;
        func=func.replace(/\s/g,'').toLowerCase();
        
        var getFInfoOut=getFInfo(func,isCond);
        
        if(getFInfoOut.type==1){
            //Is table
            return evalHumanTable(getFInfoOut);
        }
        var Errors=getFInfoOut.Errors;
        var xDepend=getFInfoOut.xDepend;
        var yDepend=getFInfoOut.yDepend;
        var thetaDepend=getFInfoOut.thetaDepend;
        var xEq=getFInfoOut.xEq;
        func=getFInfoOut.func;
        var hasPM=getFInfoOut.hasPM;
        f[0]=func;
        fInfo[0]=0;
        
        if(Errors.length){///////////////
            evalFinThis='000er000';
            return {
                'humanFThis': humanFThis,
                'allFinThis': allFinThis,
                'evalFinThis': evalFinThis,
                'Errors': Errors,
                'depend': 0,
                'xEq': 0,
                'hasPM': hasPM
            }
        }
        
        //Convert function names to avoid conflict
        var funcReplace=new Array(['max','maz'],['ceil','cil'],['arcsin','ain'],['arccos','aos'],['arctan','aan'],['sinh','sih'],['cosh','coh'],['tanh','tah']);
        
        var noOfFunc=funcReplace.length;
        
        for(funcConI=0;funcConI<noOfFunc;funcConI++){
            f[0]=f[0].replace(funcReplace[funcConI][0],funcReplace[funcConI][1]);
        }
        //Convert function names to avoid conflict
        
        var fPMi;
        
        //For Plus or Minus
        var patt1=/(\+\-)/;
        var fPM=new Array();
        fPM[0]=f[0];
        for(fPMi=0;fPMi<fPM.length;fPMi++){
                var PlusOrMinus=fPM[fPMi].match(patt1);
                if(Array.isArray(PlusOrMinus)){
                    fPM[fPM.length]=fPM[fPMi].replace(patt1,'+');
                    fPM[fPM.length]=fPM[fPMi].replace(patt1,'-');
                }
        }
        if(fPM.length>1)fPM.splice(1,((fPM.length-1)/2)-1);
        
        var patt1=/(^|sin|cos|log|ln|tan|sqrt|abs|floor|cil|round|ain|aos|aan|sih|coh|tah|\*|\/|\^|\()(\+)/g;
        var patt2=/\)/g;        /////////Only for Geany
        for(fPMi=1;fPMi<fPM.length;fPMi++){
            fPM[fPMi]=fPM[fPMi].replace(patt1,'\$1');
        }
        //For Plus or Minus Done
        
        for(fPMi=0;fPMi<fPM.length;fPMi++){
            f=new Array();
            fInfo=new Array();
            fInfo[0]=0;
            f[0]=fPM[fPMi];
            
            //This is before anything else to avoid conflict with f[*] and [*]
            //For floor("[*]") function
            var pattS = /\[([^\[]*)\]/g;
            while(f[0].match(pattS)){
                var STemp=f[0].match(pattS);
                if(Array.isArray(STemp)){
                    f[0]=f[0].replace(pattS,"floor($1)");
                }
            }
            //For floor("[*]") function Done
            
            //Get decimal numbers as f[x]
            var patt = /(\d*(\.)?\d+)/g;
            f[0]=f[0].replace(patt,'numb\$1');
            var patt = /numb(\d*(\.)?\d+)/g;
            var decim,decimi;
            if(decim=f[0].match(patt)){
                for(decimi=0;decimi<decim.length;decimi++){
                    var temp=f.length;
                    f[temp]=decim[decimi].replace(patt,'\$1');
                    fInfo[temp]=3;
                    f[0]=f[0].replace(decim[decimi],'f['+temp+']');
                }
            }
            //Get decimal numbers as f[x] Done
            
            //Get pi or p as PI
            var temp=f.length;
            var patt=/(pi|p|π)/g;
            if(f[0].match(patt)){
                f[0]=f[0].replace(patt,'f['+temp+']');
                f[temp]='p';
                fInfo[temp]=6;
            }
            //Get pi or p as PI Done
            
            //Get theta
            var temp=f.length;
            var patt=/(theta|θ)/g;
            if(f[0].match(patt)){
                f[0]=f[0].replace(patt,'f['+temp+']');
                f[temp]='theta';
                fInfo[temp]=9;
            }
            //Get theta Done
            
            //Get r
            if(isCond){
                var temp=f.length;
                var patt=/r/g;
                if(f[0].match(patt)){
                    f[0]=f[0].replace(patt,'f['+temp+']');
                    f[temp]='r';
                    fInfo[temp]=10;
                }
            }
            //Get r Done
            
            //Get e
            var temp=f.length;
            var patt=/e/g;
            if(f[0].match(patt)){
                f[0]=f[0].replace(patt,'f['+temp+']');
                f[temp]='e';
                fInfo[temp]=7;
            }
            //Get e Done
            
            brackets();//Seprate brackets
            
            var pattS,flen,funs,STemp,DoNotCreateNew,Sk,pattTemp,fNo,fCheck,tempS;
            
            //Get min,max(maz)
            pattS = /(min|maz)(f\[\d+\])/g;
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                STemp=f[funs].match(pattS);
                if(Array.isArray(STemp)){
                    if(STemp.length==1 && STemp[0]==f[funs]){DoNotCreateNew=1;}
                    else {DoNotCreateNew=0;}
                    for(Sk=0;Sk<STemp.length;Sk++){
                        pattTemp = /(min|maz)f\[(\d+)\]/g;
                        fNo=STemp[Sk].replace(pattTemp,'\$2');
                        fCheck=fInfo[fNo];
                        if(fCheck!=1)continue;
                        if(DoNotCreateNew)tempS=funs;
                        else tempS=f.length;
                        f[tempS]=STemp[Sk];
                        f[tempS]=f[tempS].replace('f['+fNo+']',f[fNo]);
                        fInfo[tempS]=8;
                        if(!DoNotCreateNew)f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');
                    }
                }
            }
            //Get min,max(maz) Done
            
            //Separat sin,cos,tan,abs,log,ln,sqrt,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh with defined bracket into their own function
            pattS = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)(f\[\d+\])/g;
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                STemp=f[funs].match(pattS);
                if(Array.isArray(STemp)){
                    if(STemp.length==1 && STemp[0]==f[funs]){break;}
                    for(Sk=0;Sk<STemp.length;Sk++){
                        pattTemp = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)f\[(\d+)\]/g;
                        fCheck=fInfo[STemp[Sk].replace(pattTemp,'\$2')];
                        if(fCheck==3 || fCheck==6 || fCheck==7)continue;
                        tempS=f.length;
                        f[tempS]=STemp[Sk];
                        fInfo[tempS]=4;
                        f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');
                    }
                }
            }
            //For sin,cos,tan,abs,log,ln,sqrt,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh Done
                    
            multiCorrect();//correct ax into a*x
            
            //For simple abs functions
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                STemp=f[funs].match(/\|/g);
                if(Array.isArray(STemp)){
                    if(STemp.length%2!=0){
                        //Error massage here
                        break;
                    }
                    if(STemp.length==2 && (f[funs][0]!='|' || f[funs][f[funs].length-1]!='|')){
                        f[funs]=f[funs].replace(/\|(.*)\|/,'abs(\$1)');
                    }
                }
            }
            brackets();
            //For simple abs functions Done
            
            //Separat sin,cos,tan,abs,log,ln,sqrt,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh into their own function
            pattS = /(sin|cos|tan|abs|log|ln|sqrt|floor|cil|round|ain|aos|aan|sih|coh|tah)(\+\-|\-)?(x|y|\d+|f\[\d+\])/g;
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                while(f[funs].match(pattS)){
                    STemp=f[funs].match(pattS);
                    if(Array.isArray(STemp)){
                        if(STemp.length==1 && STemp[0]==f[funs]){break;}
                        for(Sk=0;Sk<STemp.length;Sk++){
                            tempS=f.length;
                            f[tempS]=STemp[Sk];
                            fInfo[tempS]=4;
                            f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');
                        }
                    }
                    multiCorrect();
                }
            }
            //For sin,cos,tan,abs,log,ln,sqrt,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh Done
            
            //For power by ^ to powx,y
            pattS = /(x|y|\d+|f\[\d+\])\^(\+\-|\-)?(x|y|\d+|f\[\d+\])/g;
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                while(f[funs].match(pattS)){
                    STemp=f[funs].match(pattS);
                    if(Array.isArray(STemp)){
                        for(Sk=0;Sk<STemp.length;Sk++){
                            if(STemp.length==1 && STemp[0]==f[funs]){tempS=funs;}
                            else {tempS=f.length;}
                            f[tempS]=STemp[Sk].replace(pattS,'pow\$1,\$2\$3');
                            fInfo[tempS]=4;
                            f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');
                        }
                    }
                    multiCorrect();
                }
            }
            //For power done
            
            //Prioritize 1/x
            pattS = /(x|y|\d+|f\[\d+\])\/(x|y|\d+|f\[\d+\])/g;
            flen=f.length;
            for(funs=0;funs<flen;funs++){
                while(f[funs].match(pattS)){
                    STemp=f[funs].match(pattS);
                    if(Array.isArray(STemp)){
                        if(STemp.length==1 && STemp[0]==f[funs]){fInfo[funs]=5;break;}
                        for(Sk=0;Sk<STemp.length;Sk++){
                            tempS=f.length;
                            f[tempS]=STemp[Sk];
                            fInfo[tempS]=5;
                            f[funs]=f[funs].replace(STemp[Sk],'f['+tempS+']');
                        }
                    }
                    multiCorrect();
                }
            }
            //Prioritize 1/x done
            
            //////////Important: Do not run brackets after this
            //To convert sin,cos,tan,log,ln,sqrt,pow,abs,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh,p,e in real functions
            var i;
            for(i=0;i<f.length;i++){
                if(f[i].substr(0,3)=='sin'){
                    f[i]=f[i].replace('sin','sinf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='cos'){
                    f[i]=f[i].replace('cos','cosf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='tan'){
                    f[i]=f[i].replace('tan','tanf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='ain'){ // Arcsin
                    f[i]=f[i].replace('ain','ainf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='aos'){ // Arccos
                    f[i]=f[i].replace('aos','aosf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='aan'){ // Arctan
                    f[i]=f[i].replace('aan','aanf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='sih'){ // sinh
                    f[i]=f[i].replace('sih','sihf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='coh'){ //cosh
                    f[i]=f[i].replace('coh','cohf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='tah'){ //tanh
                    f[i]=f[i].replace('tah','tahf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='abs'){
                    f[i]=f[i].replace('abs','absf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,5)=='floor'){
                    f[i]=f[i].replace('floor','floorf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='cil'){
                    f[i]=f[i].replace('cil','cilf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,5)=='round'){
                    f[i]=f[i].replace('round','roundf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='log'){
                    f[i]=f[i].replace('log','logf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='pow'){
                    f[i]=f[i].replace('pow','powf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,2)=='ln'){
                    f[i]=f[i].replace('ln','lnf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,4)=='sqrt'){
                    f[i]=f[i].replace('sqrt','sqrtf(');
                    f[i]=f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i].substr(0,3)=='min'){
                    f[i]=f[i].replace('min','minf([');
                    f[i]=f[i]+'])';
                    fInfo[i]=8;
                }
                if(f[i].substr(0,3)=='maz'){
                    f[i]=f[i].replace('maz','mazf([');
                    f[i]=f[i]+'])';
                    fInfo[i]=8;
                }
                if(f[i][0]=='|' && f[i][f[i].length-1]=='|'){
                    f[i]=f[i].substr(1,f[i].length-2);
                    f[i]='absf('+f[i]+')';
                    fInfo[i]=4;
                }
                if(f[i]=='p'){
                    f[i]=Math.PI;
                    fInfo[i]=6;
                }
                if(f[i]=='e'){
                    f[i]=Math.E;
                    fInfo[i]=7;
                }
            }
            //To convert sin,cos,tan,log,ln,sqrt,pow,floor,ceil,round,arcsin,arccos,arctan,sinh,cosh,tanh,p,e in real functions Done
            
            //To get final string to evaluate
            //get f[x] sequance
            var seq=new Array();
            var patt1=/f\[(\d+)\]/g;
            var seqi,seqm;
            seq[0]=0;
            for(seqi=0;seqi<seq.length;seqi++){
                if(fInfo[seq[seqi]]==6 || fInfo[seq[seqi]]==7)continue;
                seqm=f[seq[seqi]].match(patt1);
                if(Array.isArray(seqm)){
                    for(l=0;l<seqm.length;l++){
                        seq[seq.length]=seqm[l].replace(patt1,'\$1');
                    }
                }
            }
            
            var fEvalTmp=f.slice(0);
            var patt1=/f\[(\d+)\]/g;
            var i;
            for(i=0;i<fEvalTmp.length;i++){
                if(typeof fEvalTmp[i]=='string')
                fEvalTmp[i]=fEvalTmp[i].replace(patt1,'fEvalTmp[\$1]');
            }
            //Create eval string -- which checks itself while evaluate for undefined terms
            var str='er=0;';
            for(seqi=seq.length-1;seqi>=0;seqi--){
                str+='if(er==0){fEvalTmp['+seq[seqi]+']='+fEvalTmp[seq[seqi]]+';}if(er==1 || isNaN(fEvalTmp['+seq[seqi]+'])){fEvalTmp['+seq[seqi]+']=Number.NaN;er=1;}';
            }
            
            if(fPM.length>1 && fPMi!=0){ //If puls-minus is there
                if(!Array.isArray(allFinThis))allFinThis=new Array();
                allFinThis[fPMi-1]=f.slice(0);
                
                if(!Array.isArray(evalFinThis))evalFinThis=new Array();
                evalFinThis[fPMi-1]=str;
            }
            else if(fPM.length==1){
                allFinThis=f.slice(0);
                evalFinThis=str;
            }
            else{
            }
            
            //Get a human readable function
            if(fPMi==0){
                humanFThis=backHumanFunction();
                if(!isCond){
                    if(xEq==0)humanFThis='y = '+humanFThis;
                    else if(xEq==1)humanFThis='x = '+humanFThis;
                    else if(xEq==4)humanFThis='r = '+humanFThis;
                }
            }
            //Get a human readable function Done
        }
        
        var dependancy=xDepend+(yDepend<<1)+(thetaDepend<<3);
        return {
            'humanFThis': humanFThis,
            'allFinThis': allFinThis,
            'evalFinThis': evalFinThis,
            'Errors': Errors,
            'depend': dependancy,
            'xEq': xEq,
            'hasPM': hasPM
        }
    }
    
    var brackets=function(){
        //Requires f, fInfo
        //for separating brackets
        var b9=0,b0=0,bstart=0,bstarti,bendi;
        var started=0;
        var i,j,fn,temp;
        for(j=0;j<f.length;j++){
            fn=f[j];
            for(i=0;i<fn.length;i++){
                if(fn[i]=='('){
                    b9++;
                    if(bstart!=1){bstart=1;bstarti=i;}
                }
                else if(fn[i]==')'){
                    b0++;
                    if(b9==b0 && bstart==1){
                        bendi=i;bstart=0;
                        if(bendi==fn.length-1 && bstarti==0){   //to reduce unnecessary brackets
                            f[j]=fn.substr(bstarti+1,bendi-bstarti-1);
                            j--;
                        }
                        else{
                            temp=f.length;
                            f[temp]=fn.substr(bstarti+1,bendi-bstarti-1);
                            fInfo[temp]=1;
                            f[j]=f[j].replace('('+f[temp]+')','f['+temp+']');
                        }
                    }
                }
            }
        }
        //brackets separated
        return 1;
    }
    
    var multiCorrect=function(){
        //Requires f, fInfo
        //for xf[d],3x,f[d]f[d]
        var multiCorrected=0;
        var flen=f.length;
        var dd,k,multii,tempm,multiCheck,multiTemp,multiChecki;
        var patt1=new Array();
        patt1[0] = /(x|y|\d+|f\[\d+\])(x|y|f\[\d+\])/g;
        patt1[1] = /(x|y|f\[\d+\])(x|y|\d+|f\[\d+\])/g;
        for(dd=0;dd<=1;dd++){
        var patt = patt1[dd];
        for(k=0;k<flen;k++){
        if(fInfo[k]==3)continue;
        while(f[k].match(patt)){
            multiTemp=f[k].match(patt);
            for(multii=0;multii<multiTemp.length;multii++){//for each match
                if(multiTemp.length==1 && multiTemp[0]==f[k])tempm=k;//decrease unnecessary f[]
                else tempm=f.length;
                multiCheck=multiTemp[multii].match(/f\[(\d+)\]/g);
                if(Array.isArray(multiCheck)){//To get if already multicorrected
                    for(multiChecki=0;multiChecki<multiCheck.length;multiChecki++){
                        multiCheck[multiChecki]=multiCheck[multiChecki].replace(/f\[(\d+)\]/g,'\$1');
                        if(fInfo[multiCheck[multiChecki]]==2){multiCorrected=1;}
                    }
                }
                f[tempm]=multiTemp[multii].replace(patt,'\$1*\$2');
                if(multiCorrected==1){
                    for(multiChecki=0;multiChecki<multiCheck.length;multiChecki++){ 
                        var pattT='f['+multiCheck[multiChecki]+']';
                        if(fInfo[multiCheck[multiChecki]]==2)
                        f[tempm]=f[tempm].replace(pattT,f[multiCheck[multiChecki]]);
                    }
                    multiCorrected=0;
                }
                f[k]=f[k].replace(multiTemp[multii],'f['+tempm+']');
                fInfo[tempm]=2;
            }
        }
        }
        }
        //for xf[d],3x,f[d]f[d] Corrected
        return 1;
    }
    
    var backHumanFunction=function(){
        //Requires f, fInfo
        //Changed to use LaTeX
        //Backup can be found in user_26_4_2013_10_??am
        var fH=f.slice(0);
        var power=0;
        var pInfo=new Array();
        var patt=/f\[\d+\]/g;
        var fHi,child,chi;
        var humanFtmp;
        var patt1;
        for(fHi=0;fHi<fH.length;fHi++){
            if(fInfo[fHi]==0){
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=0;
                    }
                }
            }
            else if(fInfo[fHi]==1){
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=1;
                    }
                }
            }
            else if(fInfo[fHi]==2){
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=2;
                    }
                }
            }
            else if(fInfo[fHi]==3){
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=3;
                    }
                }
            }
            else if(fInfo[fHi]==4){
                patt1=/(sin|cos|tan|ln|log|round)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\$1\\left(\$2\\right)');
                }
                patt1=/(ain)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'arcsin\\left(\$2\\right)');
                }
                patt1=/(aos)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'arccos\\left(\$2\\right)');
                }
                patt1=/(aan)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'arctan\\left(\$2\\right)');
                }
                patt1=/(sih)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'sinh\\left(\$2\\right)');
                }
                patt1=/(coh)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'cosh\\left(\$2\\right)');
                }
                patt1=/(tah)f\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'tanh\\left(\$2\\right)');
                }
                patt1=/powf\((.*),(.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'{\$1}^{\$2}');
                    power=1;
                }
                patt1=/absf\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\\left|{\$1}\\right|');
                }
                patt1=/floorf\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\\lfloor{\$1}\\rfloor');
                }
                patt1=/cilf\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\\lceil{\$1}\\rceil');
                }
                patt1=/sqrtf\((.*)\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\\sqrt{\$1}');
                }
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        if(power==1){
                            pInfo[child[chi]]=9;                                //pInfo===9-->power
                            power=0;
                        }
                        else {
                            pInfo[child[chi]]=4;
                        }
                    }
                }
            }
            else if(fInfo[fHi]==5){
                patt1=/(.*)\/(.*)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\\frac{\$1}{\$2}');
                }
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=5;
                    }
                }
            }
            else if(fInfo[fHi]==6){
                fH[fHi]='\\pi';
            }
            else if(fInfo[fHi]==7){
                fH[fHi]='e';
            }
            else if(fInfo[fHi]==8){
                patt1=/(min)f\(\[(.*)\]\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'\$1\\left(\$2\\right)');
                }
                patt1=/(maz)f\(\[(.*)\]\)/;
                if(patt1.test(fH[fHi])){
                    fH[fHi]=fH[fHi].replace(patt1,'max\\left(\$2\\right)');
                }
                if(fH[fHi].match(patt)){
                    child=fH[fHi].match(patt);
                    for(chi=0;chi<child.length;chi++){
                        child[chi]=child[chi].replace(/f\[(\d+)\]/,'\$1');
                        pInfo[child[chi]]=8;
                    }
                }
            }
            else if(fInfo[fHi]==9){
                fH[fHi]='\\theta';
            }
            if(fHi==0)humanFtmp=fH[0];
        }
        patt=/f\[\d+\]/g;
        for(fHi=0;fHi<fH.length;fHi++){
            if(fH[fHi].match(patt)){
                child=fH[fHi].match(patt);
                if(fH[fHi]==child[0]){
                    child[0]=child[0].replace(/f\[(\d+)\]/,'\$1');
                    pInfo[child[0]]=pInfo[fHi];
                    fInfo[fHi]=fInfo[child[0]];
                }
            }
        }
        patt=/f\[\d+\]/g;
        var humMi,humM;
        while(fH[0].match(patt)){
            humM=fH[0].match(patt);
            for(humMi=0;humMi<humM.length;humMi++){
                humM[humMi]=humM[humMi].replace(/f\[(\d+)\]/,'\$1');
                if((fInfo[humM[humMi]]==4 || fInfo[humM[humMi]]==5 || pInfo[humM[humMi]]==4 || pInfo[humM[humMi]]==8) && pInfo[humM[humMi]]!=9){
                    fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);
                }
                else if(pInfo[humM[humMi]]==5 || fInfo[humM[humMi]]==3 || fInfo[humM[humMi]]==6 || fInfo[humM[humMi]]==7 || fInfo[humM[humMi]]==9 || fH[humM[humMi]]=='x' || fH[humM[humMi]]=='y' || fH[humM[humMi]]=='r'){
                    fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);
                }
                else if(fInfo[humM[humMi]]==2 && pInfo[humM[humMi]]==2){
                    fH[0]=fH[0].replace('f['+humM[humMi]+']',fH[humM[humMi]]);
                }
                else {
                    fH[0]=fH[0].replace('f['+humM[humMi]+']','\\left('+fH[humM[humMi]]+'\\right)');
                }
            }
        }
        humanFtmp=fH[0].replace(/\*/g,'&sdot;').replace(/\+\-/g,'\\pm ');
        return humanFtmp;
    }

    var getFInfo=function(func,isCond){
        //allowed=sincosloglntanepsqrtabsfloorceilroundarcsinarccosarctansinhcoshtanhminmax.+-*/()[]|^0123456789xy;
        /*returns an object with info
         * return.type == 
         * 0 --> cartesian form
         * 1 --> table
         * 2 --> polar form
         */     
        
        func=func.replace(/\s/g,'').toLowerCase();
        var Errors=new Array();
        var xEq;
        var patt1,patt2,pattS;
        
        //For table
        //TODO: proper error detection for table
        var patt1=/(\(-?(\d*.?\d+|pi|p|e),-?(\d*.?\d+|pi|p|e)\),?)+/g;
        var table=func.match(patt1);
        if(Array.isArray(table) && table[0]==func)table=1;
        else table=0;
        
        if(table){
            return {'Errors': Errors, 'type': 1, 'func':func};
        }
        //For table Done
                
        //For equality 
        var patt1=/=/g;
        var eq=func.match(patt1);
        if(Array.isArray(eq))eq=1;
        else eq=0;
        //For equality
        
        if(eq){
            if(func[1]=='='){
                if(func[0]=='y')xEq=0;
                else if(func[0]=='x')xEq=1;
                //xEq=2 --> table
                else if(func[0]=='r')xEq=4;
                else Errors[Errors.length]=16;
            }
            else Errors[Errors.length]=16;
            func=func.substr(2);
        }
        else xEq=-1;
        
        //For unexpected chars
        if(isCond)
            pattS=/(sinh|cosh|tanh|arcsin|arccos|arctan|ceil|sin|cos|log|ln|tan|theta|θ|e|pi|p|π|sqrt|abs|floor|round|min|max|,|\.|\+|\-|\*|\/|\(|\)|\[|\]|\||\^|\d|x|y|r)/g;
        else
            pattS=/(sinh|cosh|tanh|arcsin|arccos|arctan|ceil|sin|cos|log|ln|tan|theta|θ|e|pi|p|π|sqrt|abs|floor|round|min|max|,|\.|\+|\-|\*|\/|\(|\)|\[|\]|\||\^|\d|x|y)/g;
        var ErrTokenTemp=func.replace(pattS,' ').split(' ');
        var ErrToken=new Array();
        var ErrTno=0;
        var ErrTokenI;
        for(ErrTokenI=0;ErrTokenI<ErrTokenTemp.length;ErrTokenI++){
            if(ErrTokenTemp[ErrTokenI]!='')ErrToken[ErrTno]=ErrTokenTemp[ErrTokenI];
        }
        if(ErrToken.length>0)Errors[Errors.length]=2;
        //For unexpected chars Done
        
        var b9match,b0match,b9count,b0count;
        //For Bracket Maches
        patt1=/\(/g;
        patt2=/\)/g;
        b9match=func.match(patt1);
        b0match=func.match(patt2);
        b9count=Array.isArray(b9match)?b9match.length:0;
        b0count=Array.isArray(b0match)?b0match.length:0;
        if(b9count!=b0count)Errors[Errors.length]=3;
        //For Bracket Maches Done
        
        //For "[]" Maches
        patt1=/\[/g;
        patt2=/\]/g;
        b9match=func.match(patt1);
        b0match=func.match(patt2);
        b9count=Array.isArray(b9match)?b9match.length:0;
        b0count=Array.isArray(b0match)?b0match.length:0;
        if(b9count!=b0count)Errors[Errors.length]=3;
        //For "[]" Maches Done
        
        //For Mod('|') Maches
        patt1=/\|/g;
        var ModMatch=func.match(patt1);
        var ModCount=Array.isArray(ModMatch)?ModMatch.length:0;
        if(ModCount%2)Errors[Errors.length]=4;
        else if(ModCount>2){
            patt1=/\(\|/g;
            patt2=/\|\)/g;
            var m9match=func.match(patt1);
            var m0match=func.match(patt2);
            var m9count=Array.isArray(m9match)?m9match.length:0;
            var m0count=Array.isArray(m0match)?m0match.length:0;
            if((m9count!=m0count) || (ModCount!=m9count+m0count))Errors[Errors.length]=5;
        }
        //For Mod('|') Maches Done
        
        //For empty brackets or abs or floor
        patt1=/\((\.|\*|\+|\-|\/|\^|\.)*\)/g;
        var EmptyB=func.match(patt1);
        if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=6;
        patt1=/\(?\|(\.|\*|\+|\-|\/|\^)*\|\)?/g;
        EmptyB=func.match(patt1);
        if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=7;
        patt1=/\[(\.|\*|\+|\-|\/|\^|\.)*\]/g;
        EmptyB=func.match(patt1);
        if(Array.isArray(EmptyB) && EmptyB.length>0)Errors[Errors.length]=14;
        //For empty brackets or abs or floor Done
        
        //For unexpected dot
        patt1=/\.[^\d]/g;
        var unDot=func.match(patt1);
        var unDotCount=Array.isArray(unDot)?unDot.length:0;
        if(unDotCount)Errors[Errors.length]=8;
        //For unexpected dot Done
        
        var unPow,unPowCount;
        //For unexpected pow
        patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|\.|\+|\-|\*|\/|\(|\[|\^)\^/g;
        unPow=func.match(patt1);
        unPowCount=Array.isArray(unPow)?unPow.length:0;
        if(unPowCount)Errors[Errors.length]=9;
        //For unexpected pow Done
        
        //For unexpected operators
        patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|\+|\-|\*|\/|\^|\(|\[)(\+|\*|\/|\))[^\-]/g;
        patt2=/\)/g;        /////////Only for Geany
        unPow=func.match(patt1);
        unPowCount=Array.isArray(unPow)?unPow.length:0;
        if(unPowCount)Errors[Errors.length]=10;
        //For unexpected operators Done
        
        //For missing value
        patt1=/(sinh|cosh|tanh|sin|cos|log|ln|tan|sqrt|abs|floor|ceil|round|arcsin|arccos|arctan|min|max|\+|\-|\*|\/|\^|\(|\[)$/g;
        patt2=/\)/g;        /////////Only for Geany
        unPow=func.match(patt1);
        unPowCount=Array.isArray(unPow)?unPow.length:0;
        if(unPowCount)Errors[Errors.length]=11;
        //For missing value Done
        
        //For min/max bracket availibility
        patt1=/(min|max)[^\(]/g;
        patt2=/\)/g;        /////////Only for Geany
        unPow=func.match(patt1);
        unPowCount=Array.isArray(unPow)?unPow.length:0;
        if(unPowCount)Errors[Errors.length]=12;
        //For min/max bracket availibility Done
        
        //For unexpected comma
        var exComCount=0;
        var strToPross=func;
        patt1=/(min|max)/g;
        var AllMinMax=strToPross.match(patt1);
        var minMaxFound=Array.isArray(AllMinMax)?AllMinMax.length:0;
        var i,startCheck,ignList;
        for(i=0;i<minMaxFound;i++){
            startCheck=strToPross.indexOf(AllMinMax[i])+4;
            ignList=0;
            for(j=startCheck;j<strToPross.length;j++){
                if(strToPross[j]=='('){
                    ignList++;
                }
                else if(strToPross[j]==')'){
                    if(ignList)ignList--;
                    else strToPross=strToPross.substr(j+1);
                    break;
                }
                else if(strToPross[j]==','){
                    exComCount++;
                }
            }
        }
        patt1=/,/g;
        var unCom=func.match(patt1);
        var unComCount=Array.isArray(unCom)?unCom.length:0;
        if(unComCount!=exComCount)Errors[Errors.length]=13;
        //For unexpected comma Done
        
        //convert max into maz
        func=func.replace('max','maz');
        //convert max into maz Done
        
        //For plus-minus
        patt1=/(\+\-)/;
        var hasPM=func.match(patt1);
        if(Array.isArray(hasPM))hasPM=1;
        else hasPM=0;
        //For plus-minus
        
        //For dependency upon x 
        patt1=/x/g;
        var xDepend=func.match(patt1);
        if(Array.isArray(xDepend))xDepend=1;
        else xDepend=0;
        //For dependency upon x 
        
        //For dependency upon y 
        patt1=/y/g;
        var yDepend=func.match(patt1);
        if(Array.isArray(yDepend))yDepend=1;
        else yDepend=0;
        //For dependency upon y
        
        //For dependency upon theta
        patt1=/(theta|θ)/g;
        var thetaDepend=func.match(patt1);
        if(Array.isArray(thetaDepend))thetaDepend=1;
        else thetaDepend=0;
        //For dependency upon theta
        
        if(xEq==-1){
            if(thetaDepend)xEq=4;
            else if(yDepend)xEq=1;
            else xEq=0;
        }
        if(thetaDepend && xDepend && yDepend && !isCond)Errors[Errors.length]=15;
        else if(xDepend && xEq!=0 && !isCond)Errors[Errors.length]=16;
        else if(yDepend && xEq!=1 && !isCond)Errors[Errors.length]=16;
        else if(thetaDepend && xEq!=4 && !isCond)Errors[Errors.length]=16;
        
        var type=0;
        if(thetaDepend)
            type=2;
        return {'Errors': Errors, 'type': type, 'xDepend': xDepend, 'yDepend': yDepend, 'thetaDepend': thetaDepend, 'xEq':xEq, 'func':func, 'hasPM': hasPM};
    }
    
    //sinf,cosf,tanf,logf,lnf,sqrtf,powf,minf,mazf,absf,floorf,cilf(ceil),roundf,ainf(arcsin),aosf(arccos),aanf(arctan),sihf(sinh),cohf(cosh),tahf(tanh)
    var sinf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = Math.sin(v);
        return ans;
    }
    var cosf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = Math.cos(v);
        return ans;
    }
    var tanf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = Math.tan(v);
        return ans;
    }
    var logf=function(v){
        var ans = Math.log(v)/Math.LN10;
        return ans;
    }
    var lnf=function(v){
        var ans = Math.log(v);
        return ans;
    }
    var sqrtf=function(v){
        var ans = Math.sqrt(v);
        return ans;
    }
    var powf=function(u,v){
        var ans = Math.pow(u,v);
        return ans;
    }
    var minf=function(u){
        if(!Array.isArray(u))return u;
        var ans=u[0];
        var i;
        for(i=1;i<u.length;i++){
            if(u[i]<ans)ans=u[i];
        }
        return ans;
    }
    var mazf=function(u){//maxf
        if(!Array.isArray(u))return u;
        var ans=u[0];
        var i;
        for(i=1;i<u.length;i++){
            if(u[i]>ans)ans=u[i];
        }
        return ans;
    }
    var absf=function(u){
        var ans = Math.abs(u);
        return ans;
    }
    var floorf=function(u){
        var ans = Math.floor(u);
        return ans;
    }
    var cilf=function(u){
        var ans = Math.ceil(u);
        return ans;
    }
    var roundf=function(u){
        var ans = Math.round(u);
        return ans;
    }
    var ainf=function(v){ // Arcsin
        var ans = Math.asin(v);
        if(trigDegree)ans*=(180/Math.PI);
        return ans;
    }
    var aosf=function(v){ // Arccos
        var ans = Math.acos(v);
        if(trigDegree)ans*=(180/Math.PI);
        return ans;
    }
    var aanf=function(v){ //Arctan
        var ans = Math.atan(v);
        if(trigDegree)ans*=(180/Math.PI);
        return ans;
    }
    var sihf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = (Math.exp(v)-Math.exp(-v))/2;
        return ans;
    }
    var cohf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = (Math.exp(v)+Math.exp(-v))/2;
        return ans;
    }
    var tahf=function(v){
        if(trigDegree)v=Math.PI*(v/180);
        var ans = (1-Math.exp(-2*v))/(1+Math.exp(-2*v));
        return ans;
    }
    
    var toDigit=function(no,to){
        var toDtemp=Math.abs(no).toPrecision(to);
        var toDP=(2*to)+1-toDtemp.toString().length;
        if(toDP>20 || toDP<1)return no.toPrecision(to);
        var toDig=no.toPrecision(toDP);
        //Gives long values on smaller numbers: FIXME
        return toDig;
    }
    /*var textWidth=function(txt,fntSize){
        tmp=document.createElement('div');
        tmp.style.fontSize=fntSize+'px';
        tmp.style.position='fixed';
        tmp.style.visibility='hidden';
        tmp.style.zIndex=-10;
        tmp.innerHTML=txt;
        document.body.appendChild(tmp);
        ans=tmp.offsetWidth;
        tmp.parentNode.removeChild(tmp);
        return ans;
    }*/
        
    
    //2. For Graphing Only
    var cH,cW,scaleX,scaleY,origX,origY,rangeXstart,rangeXend,rangeYstart,rangeYend;
    
    ////To Be change in setgDefault
    var zoomX=1;
    var zoomY=1;
    var showGrid=1;
    var showLabelIndecator=0;
    var showLabel=1;
    var showAxis=1;
    var trackBall=1;
    var coTracker=1;
    var trigDegree=0;
    cH=500;cW=500;
    scaleX=64;scaleY=64;
    origX=cW/2;origY=cH/2;
    ////
    var setCan=function(){
        var c=document.getElementById('ugraph');
        var cHelp=document.getElementById('ugraphHelp');
        
        var origXMulti=origX/cW;
        var origYMulti=origY/cH;
        
        origX=cW*origXMulti;
        origY=cH*origYMulti;
        
        c.style.position='absolute';
        c.style.zIndex=0;
        cHelp.style.position='absolute';
        cHelp.style.zIndex=1;
        c.style.top='0px';
        cHelp.style.top='0px';
        c.style.left='0px';
        cHelp.style.left='0px';
        c.width=cW;
        c.height=cH;
        cHelp.width=cW;
        cHelp.height=cH;
        prepareg();
    }
    var preparegHelp=function(){
        var c=document.getElementById('ugraphHelp');
        var ctx=c.getContext('2d');
        ctx.clearRect(0,0,cW,cH);
    }
    var prepareg=function(){
        preparegHelp();
        /*c=document.getElementById('ugraphHelp');
        ctx=c.getContext('2d');
        ctx.font="30pt Georgia";
        ctx.fillStyle='black';
        c.style.background='rgba(255,255,255,0.5)';
        textwidth=ctx.measureText('Please wait...').width;
        ctx.fillText('Please wait...',(cW-textwidth)/2,cH/2);*///FIXME
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        ctx.strokeStyle='black';
        ctx.fillStyle='black';
        ctx.clearRect(0,0,cW,cH);
        var textwidth,DX,DY,Xcoy,Ycox;
        ctx.font="10pt Georgia";
        var de="\u00a9 "+"N"+"isa"+"rg"+" Jh"+"ave"+"ri";
        textwidth=ctx.measureText(de).width;
        if(cH-origY<=20){
            DX=5;
            DY=15;
        }
        else {
            DX=cW-5-textwidth;
            DY=cH-5;
        }
        ctx.fillText(de,DX,DY);
        ctx.lineWidth=0.5;
        //X-Axis
        ctx.beginPath();
        if(origY>cH){Xcoy=cH;}
        else {Xcoy=origY;}
        if(showAxis){
            ctx.moveTo(0,Xcoy);
            ctx.lineTo(cW,Xcoy);
            ctx.stroke();
        }
        //Y-Axis
        ctx.beginPath();
        if(origX>cW){Ycox=cW;}
        else {Ycox=origX;}
        if(showAxis){
            ctx.moveTo(Ycox,0);
            ctx.lineTo(Ycox,cH);
            ctx.stroke();
        }
        cartesianGrid();
    }
    var polarGrid=function(){
        //TODO : polar grid
    }
    var cartesianGrid=function(){
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        ctx.strokeStyle='black';
        ctx.fillStyle='black';
        
        var partDivide;
        //X-Coordinates
        //textheight=10px
        ctx.font="10pt Georgia";
        var nOfXCo=Math.floor(cW/scaleX);
        var lastxline=0;
        var textwidthmax=0;
        var xcoi,xCo,posX,skipX,partX,partXi,xCoy1,xCoy2,xtextY,Xstart,Xend,xCox,xCoxNext,partXCox,partXDno,partXDigit;
        for(xcoi=0;xcoi<=nOfXCo;xcoi++){
            xCo=xcoi-(Math.floor(origX/scaleX));
            textwidth=ctx.measureText(xCo).width;
            if(textwidth>textwidthmax)textwidthmax=textwidth;
        }
        if(origY<0){
            posX=3;
        }
        else if(cH-origY<0){
            posX=2;
        }
        else if(cH-origY<=20){
            posX=1;
        }else {
            posX=0;
        }
        skipX=Math.ceil((textwidthmax+40)/scaleX);
        partX=Math.floor(scaleX*skipX/20);
        if(partX%2==1 && partX>=2){
            partX++;
        }
        var repeatThis=0;
        var partXD;
        do{
            partXD=0;
            for(partDivide=1;partDivide<partX;partDivide++){
                if(partX%partDivide==0 && partDivide!=1 && partDivide!=2){
                    partXD=partDivide;
                    break;
                }
            }
            if(partXD>6){
                repeatThis=1;
                partX-=2;
            }
            else {
                repeatThis=0;
            }
        }
        while(repeatThis==1);
        xCoy1=origY;
        xCoy2=origY+5;
        if(posX==3){xCoy1=0;xCoy2=5;}
        else if(posX==2){xCoy1=cH;xCoy2=cH-5;}
        else if(posX==1){xCoy2=origY-5;}
        else {xCoy2=origY+5;}
        if(posX==2 || posX==1){xtextY=xCoy1-6;}     //To be changed in Y-Coordinates
        else {xtextY=xCoy1+15;}                     //To be changed in Y-Coordinates
        rangeXstart=-origX/scaleX;
        rangeXend=(cW-origX)/scaleX;
        Xstart=Math.floor(rangeXstart);
        Xstart=Xstart-(Xstart%skipX)-skipX;
        Xend=Math.ceil(rangeXend);
        Xend=Xend+(Xend%skipX);
        for(xcoi=Xstart;xcoi<=Xend;xcoi+=skipX){
            xCo=xcoi;
            xCox=(xCo*scaleX)+origX;
            xCoxNext=((xCo+skipX)*scaleX)+origX;
            if((xCox<0 && xCoxNext<0) || xCox>cW)continue;
            if(xCox>=0){
                //Integer grid lines
                ctx.lineWidth=1;
                if(showLabelIndecator){
                    ctx.beginPath();
                    ctx.moveTo(xCox,xCoy1);
                    ctx.lineTo(xCox,xCoy2);
                    ctx.stroke();
                }
                if(showGrid){
                    ctx.lineWidth=0.3;
                    ctx.beginPath();
                    ctx.moveTo(xCox,0);
                    ctx.lineTo(xCox,cH);
                    ctx.stroke();
                }
            }
            ctx.lineWidth=0.5;
            if(partX>=2){
                for(partXi=0;partXi<partX-1;partXi++){
                    partXCox=xCox+((partXi+1)*(scaleX*skipX/partX));
                    if(partXCox<0 || partXCox>cW)continue;
                    if((partXi+1)%partXD==0 && partXD!=0){
                        //Grid with Label
                        partXDno=(partXi+1)/partXD;
                        ctx.lineWidth=1;
                        if(showLabelIndecator){
                            ctx.beginPath();
                            ctx.moveTo(partXCox,xCoy1);
                            ctx.lineTo(partXCox,xCoy2);
                            ctx.stroke();
                        }
                        if(showGrid){
                            ctx.lineWidth=0.3;
                            ctx.beginPath();
                            ctx.moveTo(partXCox,0);
                            ctx.lineTo(partXCox,cH);
                            ctx.stroke();
                        }
                        ctx.lineWidth=0.5;
                        partXDigit=xCo+skipX*partXD*partXDno/partX;
                        partXDigit=Math.round(partXDigit*1000)/1000;
                        textwidth=ctx.measureText(partXDigit).width;
                        if(showLabel)ctx.fillText(partXDigit,partXCox-(textwidth/2)-1,xtextY);
                    }
                    else{
                        //Grid without Label
                        ctx.lineWidth=0.5;
                        if(showLabelIndecator){
                            ctx.beginPath();
                            ctx.moveTo(partXCox,xCoy1);
                            ctx.lineTo(partXCox,xCoy2);
                            ctx.stroke();
                        }
                        if(showGrid){
                            ctx.lineWidth=0.1;
                            ctx.beginPath();
                            ctx.moveTo(partXCox,0);
                            ctx.lineTo(partXCox,cH);
                            ctx.stroke();
                        }
                    }
                }
            }
            textwidth=ctx.measureText(xCo).width;
            if(showLabel)ctx.fillText(xCo,xCox-(textwidth/2)-1,xtextY);
        }
        //Y-Coordinates
        //Copy of X-Coordinates
        //textheight=10px
        ctx.font="10pt Georgia";
        var nOfYCo=Math.floor(cH/scaleY);
        var lastyline=0;
        var textwidthmax=0;
        var ycoi,yCo,posY,skipY,partY,partYi,yCoy1,yCoy2,ytextX,Ystart,Yend,yCox,yCoxPrev,partYCox,partYDno,partYDigit;
        for(ycoi=0;ycoi<=nOfYCo;ycoi++){
            yCo=ycoi-(Math.floor(origY/scaleY));
            textwidth=ctx.measureText(yCo).width;
            if(textwidth>textwidthmax)textwidthmax=textwidth;
        }
        if(origX>cW){
            posY=3;
        }
        else if(origX<0){
            posY=2;
        }
        else if(origX<=textwidthmax+5){
            posY=1;
        }else {
            posY=0;
        }
        skipY=Math.ceil((textwidthmax+40)/scaleY);
        partY=Math.floor(scaleY*skipY/20);
        if(partY%2==1 && partY>=2){
            partY++;
        }
        var repeatThis=0;
        var partYD;
        do{
            partYD=0;
            for(partDivide=1;partDivide<partY;partDivide++){
                if(partY%partDivide==0 && partDivide!=1 && partDivide!=2){
                    partYD=partDivide;
                    break;
                }
            }
            if(partYD>6){
                repeatThis=1;
                partY-=2;
            }
            else {
                repeatThis=0;
            }
        }
        while(repeatThis==1);
        yCoy1=origX;
        yCoy2=origX-5;
        if(posY==3){yCoy1=cW;yCoy2=cW-5;}
        else if(posY==2){yCoy1=0;yCoy2=5;}
        else if(posY==1){yCoy2=origX+5;}
        else {yCoy2=origX-5;}
        rangeYstart=(origY-cH)/scaleY;
        rangeYend=origY/scaleY;
        Ystart=Math.floor(rangeYstart);
        Ystart=Ystart-(Ystart%skipY)-skipY;
        Yend=Math.ceil(rangeYend);
        Yend=Yend+(Yend%skipY);
        for(ycoi=Ystart;ycoi<=Yend;ycoi+=skipY){
            yCo=ycoi;
            yCox=-(yCo*scaleY)+origY;
            yCoxPrev=-((yCo-skipY)*scaleY)+origY;
            if((yCox<0 && yCoxPrev<0) || yCox>cH)continue;
            ctx.lineWidth=1;
            if(showLabelIndecator){
                ctx.beginPath();
                ctx.moveTo(yCoy1,yCox);
                ctx.lineTo(yCoy2,yCox);
                ctx.stroke();
            }
            if(showGrid){
                ctx.lineWidth=0.3;
                ctx.beginPath();
                ctx.moveTo(0,yCox);
                ctx.lineTo(cW,yCox);
                ctx.stroke();
            }
            ctx.lineWidth=0.5;
            if(partY>=2){
                for(partYi=0;partYi<partY-1;partYi++){
                    partYCox=yCox+((partYi+1)*(scaleY*skipY/partY));
                    if(partYCox<0 || partYCox>cH)continue;
                    if((partYi+1)%partYD==0 && partYD!=0){
                        partYDno=(partYi+1)/partYD;
                        ctx.lineWidth=1;
                        if(showLabelIndecator){
                            ctx.beginPath();
                            ctx.moveTo(yCoy1,partYCox);
                            ctx.lineTo(yCoy2,partYCox);
                            ctx.stroke();
                        }
                        if(showGrid){
                            ctx.lineWidth=0.3;
                            ctx.beginPath();
                            ctx.moveTo(0,partYCox);
                            ctx.lineTo(cW,partYCox);
                            ctx.stroke();
                        }
                        ctx.lineWidth=0.5;
                        partYDigit=yCo-(skipY*partYD*partYDno/partY);
                        partYDigit=Math.round(partYDigit*1000)/1000;
                        textwidth=ctx.measureText(partYDigit).width;
                        if(posY==2 || posY==1){ytextX=yCoy1+6;}
                        else {ytextX=yCoy1-textwidth-6;}
                        if(showLabel)ctx.fillText(partYDigit,ytextX,partYCox+5);
                    }
                    else {
                        ctx.lineWidth=0.5;
                        if(showLabelIndecator){
                            ctx.beginPath();
                            ctx.moveTo(yCoy1,partYCox);
                            ctx.lineTo(yCoy2,partYCox);
                            ctx.stroke();
                        }
                        if(showGrid){
                            ctx.lineWidth=0.1;
                            ctx.beginPath();
                            ctx.moveTo(0,partYCox);
                            ctx.lineTo(cW,partYCox);
                            ctx.stroke();
                        }
                    }
                }
            }
            textwidth=ctx.measureText(yCo).width;
            if(posY==2 || posY==1){ytextX=yCoy1+6;}
            else {ytextX=yCoy1-textwidth-6;}
            if(showLabel)ctx.fillText(yCo,ytextX,yCox+5);
        }
        //12pt=16px;
        /*preparegHelp();
        c=document.getElementById('ugraphHelp');
        c.style.background='transparent';*///FIXME
    }
    
    var zoomAxis=function(zoom){
        if(zoom>0){
            if(zoomX)scaleX=scaleX*zoom;
            if(zoomY)scaleY=scaleY*zoom;
        }
        else if(zoom<0){
            if(zoomX)scaleX=scaleX/(-zoom);
            if(zoomY)scaleY=scaleY/(-zoom);
        }
        if(scaleX>65536)scaleX=65536;
        if(scaleY>65536)scaleY=65536;
        if(scaleX<0.125)scaleX=0.125;
        if(scaleY<0.125)scaleY=0.125;
        prepareg();
        plotFunc();
    }
    
    var resetAxis=function(){
        //zoomX=1;
        //zoomY=1;
        scaleX=64;scaleY=64;
        origX=cW/2;origY=cH/2;
        setCan();
        plotFunc();
    }
    
    var showAxisSet=function(mode){
        showAxis=Number(mode);
        prepareg();
        plotFunc();
    }
    var showGridSet=function(mode){
        showGrid=Number(mode);
        prepareg();
        plotFunc();
    }
    var showLabelSet=function(mode){
        showLabel=Number(mode);
        prepareg();
        plotFunc();
    }
    var showLabelInSet=function(mode){
        showLabelIndecator=Number(mode);
        prepareg();
        plotFunc();
    }
    var showTrackSet=function(mode){
        trackBall=Number(mode);
        prepareg();
        plotFunc();
    }
    var showCoTrackSet=function(mode){
        coTracker=Number(mode);
        prepareg();
        plotFunc();
    }
    var trigRadSet=function(rad){
        trigDegree=parseInt(rad);
        var fI;
        for(fI=0;fI<expression.length;fI++){
            expression[fI].fAllVals=new Array();
        }
        prepareg();
        plotFunc();
    }
    
    //3. Plot the Function
    var plotting=0;
    
    var isValidNo=function(x){
        return (x!=Number.POSITIVE_INFINITY) && (x!=Number.NEGATIVE_INFINITY) && (!isNaN(x));
    }
    var evalGetY=function(fI,isPM,PMi,x){
        var xString=x.toString();
        var toEval;
        if(isPM){
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[PMi])!='undefined'){
                    if(typeof(expression[fI].fAllVals[PMi][xString])!='undefined')
                        return expression[fI].fAllVals[PMi][xString];
                }
                else expression[fI].fAllVals[PMi]=new Array();
            }
            else {
                expression[fI].fAllVals=new Array();
                expression[fI].fAllVals[PMi]=new Array();
            }
            toEval=expression[fI].evalF[PMi];
        }
        else {
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[xString])!='undefined')
                    return expression[fI].fAllVals[xString];
            }
            else expression[fI].fAllVals=new Array();
            toEval=expression[fI].evalF;
        }
        try{
            eval(toEval);
        }
        catch(e){
            return '111er111';
        }
        var val=fEvalTmp[0];
        if(validateConds(fI,{'x':x,'y':val})==false)val=Number.NaN;
        if(isPM){
            expression[fI].fAllVals[PMi][xString]=val;
        }
        else {
            expression[fI].fAllVals[xString]=val;
        }
        return val;
    }
    var evalGetX=function(fI,isPM,PMi,y){
        var yString=y.toString();
        var toEval;
        if(isPM){
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[PMi])!='undefined'){
                    if(typeof(expression[fI].fAllVals[PMi][yString])!='undefined')
                        return expression[fI].fAllVals[PMi][yString];
                }
                else expression[fI].fAllVals[PMi]=new Array();
            }
            else {
                expression[fI].fAllVals=new Array();
                expression[fI].fAllVals[PMi]=new Array();
            }
            toEval=expression[fI].evalF[PMi];
        }
        else {
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[yString])!='undefined')
                    return expression[fI].fAllVals[yString];
            }
            else expression[fI].fAllVals=new Array();
            toEval=expression[fI].evalF;
        }
        try{
            eval(toEval);
        }
        catch(e){
            return '111er111';
        }
        var val=fEvalTmp[0];
        if(validateConds(fI,{'x':val,'y':y})==false)val=Number.NaN;
        if(isPM){
            expression[fI].fAllVals[PMi][yString]=val;
        }
        else {
            expression[fI].fAllVals[yString]=val;
        }
        return val;
    }
    var evalGetR=function(fI,isPM,PMi,t){
        var tString=t.toString();
        var toEval;
        if(isPM){
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[PMi])!='undefined'){
                    if(typeof(expression[fI].fAllVals[PMi][tString])!='undefined')
                        return expression[fI].fAllVals[PMi][tString];
                }
                else expression[fI].fAllVals[PMi]=new Array();
            }
            else {
                expression[fI].fAllVals=new Array();
                expression[fI].fAllVals[PMi]=new Array();
            }
            toEval=expression[fI].evalF[PMi];
        }
        else {
            if(typeof(expression[fI].fAllVals)!='undefined'){
                if(typeof(expression[fI].fAllVals[tString])!='undefined')
                    return expression[fI].fAllVals[tString];
            }
            else expression[fI].fAllVals=new Array();
            toEval=expression[fI].evalF;
        }
        try{
            theta=t;
            if(trigDegree)
                theta=theta*(180/Math.PI);
            eval(toEval);
        }
        catch(e){
            return '111er111';
        }
        var val=fEvalTmp[0];
        y=val*Math.sin(t);
        x=val*Math.cos(t);
        if(validateConds(fI,{'x':x,'y':y,'t':t,'r':val})==false)val=Number.NaN;//condition in r:TODO
        if(isPM){
            expression[fI].fAllVals[PMi][tString]=val;
        }
        else {
            expression[fI].fAllVals[tString]=val;
        }
        return val;
    }
    var validateConds=function(fI,vals){
        var x=vals.x;
        var y=vals.y;
        if(typeof vals.t != 'undefined')theta=vals.t;
        if(typeof vals.r != 'undefined')r=vals.r;
        if(typeof(expression[fI].evalConds)=='undefined')return true;
        var condI;
        var tmpCondVals=new Array();
        for(condI=0;condI<expression[fI].evalConds.length;condI++){
            eval(expression[fI].evalConds[condI]);
            tmpCondVals[condI]=fEvalTmp[0];
        }
        var condSuccess=true;
        for(condI=0;condI<expression[fI].condMeta.length;condI++){
            if(eval('tmpCondVals['+expression[fI].condMeta[condI][0]+']'+expression[fI].condMeta[condI][1]+'tmpCondVals['+expression[fI].condMeta[condI][2]+']')==false)
                condSuccess=false;
        }
        return condSuccess;
    }
    var getDiscon=function(data){
        var cosAngleCurr,cosAngleNext,vect1Y,vect2Y;
        var maxY,minY,maxEndX,minEndY,inc0,int1,dec0,dec1,inc,dec,yTemp,yTempLast;
        var incLast,decLast,initInc,initDec,endInc,endDec,directionChangeCount,directionChangeFreq;
        var directionChangeCount,initDirection;
        var fI=data.fI;
        var x0=data.x0;
        var y0=data.y0;
        var x=data.x;
        var y=data.y;
        var x1=data.x1;
        var y1=data.y1;
        var x2=data.x2;
        var y2=data.y2
        var X=data.X;
        var isPM=data.isPM;
        var PlotRepeatI=data.PlotRepeatI;
        var scaleX=data.scaleX;
        var getValFunc=data.getValFunc;
        var disconNext=data.disconNext;
        var disconSuspect=0;
        var vectX=1/scaleX;
        var vectXval=vectX*vectX;
        
        if(X && isValidNo(y0) && isValidNo(y) && isValidNo(y1) && isValidNo(y2)){
            vect1Y=y-y0;
            vect2Y=y1-y;
            cosAngleCurr=(vectXval+(vect1Y*vect2Y))/Math.sqrt((vectXval+(vect1Y*vect1Y))*(vectXval+(vect2Y*vect2Y)));
            if(vect1Y>0){
                inc0=1;
                dec0=0;
            }
            else if(vect1Y<0){
                inc0=0;
                dec0=1;
            }
            else {
                inc0=0;
                dec0=0;
            }
            
            vect1Y=vect2Y;
            vect2Y=y2-y1;
            cosAngleNext=(vectXval+(vect1Y*vect2Y))/Math.sqrt((vectXval+(vect1Y*vect1Y))*(vectXval+(vect2Y*vect2Y)));
            if(vect2Y>0){
                inc1=1;
                dec1=0;
            }
            else if(vect2Y<0){
                inc1=0;
                dec1=1;
            }
            else {
                inc1=0;
                dec1=0;
            }
            
            if(cosAngleCurr<0.25882 && cosAngleNext<0.25882){ //cos(75deg)
                disconSuspect=1;
            }
            else {
                disconNext=0;
            }
        }
        if(((isNaN(y) || isNaN(y1)) && (!isNaN(y) || !isNaN(y1))) || disconSuspect){
            if(disconSuspect)disconNext=1;
            maxY=y;
            minY=y;
            maxEndY=y1;
            minEndY=y1;
            var eps=(x1-x)/100;
            if(!disconSuspect){
                if(!isNaN(y)){
                    yTemp=getValFunc(fI,isPM,PlotRepeatI,x+eps);
                    if(yTemp>y){
                        inc0=1;
                        dec0=0;
                    }
                    else if(yTemp<y){
                        inc0=0;
                        dec0=1;
                    }
                    else {
                        inc0=0;
                        dec0=0;
                    }
                }
                else {
                    yTemp=getValFunc(fI,isPM,PlotRepeatI,x1-eps);
                    if(y1>yTemp){
                        inc1=1;
                        dec1=0;
                    }
                    else if(y1<yTemp){
                        inc1=0;
                        dec1=1;
                    }
                    else {
                        inc1=0;
                        dec1=0;
                    }
                }
            }
            yTemp=y;
            incLast=inc0;
            decLast=dec0;
            initInc=inc0;
            initDec=dec0;
            endInc=inc1;
            endDec=dec1;
            inc=inc0;
            dec=dec0;
            directionChangeCount=0;
            directionChangeFreq=0;
            var epsI;
            for(epsI=1;epsI<100;epsI++){
                yTempLast=yTemp;
                incLast=inc;
                decLast=dec;
                yTemp=getValFunc(fI,isPM,PlotRepeatI,x+(eps*epsI));
                if(isNaN(yTemp) || isNaN(yTempLast)){
                    yTempLast=yTemp;
                    continue;
                }
                if(disconSuspect){
                    if((yTemp<y && yTemp>y1) || (yTemp>y && yTemp<y1)){
                        disconNext=0;
                        break;
                    }
                }
                if(yTemp>yTempLast){
                    inc=1;
                    dec=0;
                }
                else if(yTemp<yTempLast){
                    inc=0;
                    dec=1;
                }
                else {
                    inc=0;
                    dec=0;
                }
                
                if(incLast!=inc || decLast!=dec){
                    directionChangeCount++;
                    directionChangeFreq=0;
                }
                else {
                    directionChangeFreq++;
                }
                
                if(!isNaN(y)){
                    if(directionChangeCount==0){
                        if(initInc && yTemp>maxY){
                            maxY=yTemp;
                        }
                        else if(initDec && yTemp<minY){
                            minY=yTemp;
                        }
                    }
                }
                if(!isNaN(y1)){
                    if(directionChangeFreq==0){
                        maxEndY=y1;
                        minEndY=y1;
                    }
                    else if(inc==endInc && dec==endDec){
                        if(endInc && yTemp<minEndY){
                            minEndY=yTemp;
                        }
                        else if(endDec&& yTemp>maxEndY){
                            maxEndY=yTemp;
                        }
                    }
                }
            }
            if(isNaN(y) || isNaN(y1) || disconNext){
                if(initInc)y=maxY;
                else if(initDec)y=minY;
                if(endInc)y1=minEndY;
                else if(endDec)y1=maxEndY;
            }
        }
        return {
            'y': y,
            'y1': y1,
            'disconNext': disconNext
        }
    }
    var plotFunc=function(){
        plotting=1;
        var fI;
        for(fI=0;fI<expression.length;fI++){
            if(expression[fI].evalF!='000er000'){
                if(expression[fI].equal==0)
                    plotFuncX(fI);
                else if(expression[fI].equal==1)
                    plotFuncY(fI);
                else if(expression[fI].equal==2)
                    plotTable(fI);
                else if(expression[fI].equal==4)
                    plotPolar(fI);
            }
        }
        plotting=0;
        return 1;
    }
    
    var plotFuncX=function(fI){
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        //var fColor=fColorList[document.getElementById('userForm').getElementsByClassName('userfunctionDiv')[fI].data('color')];
        var fColor=expression[fI].color;
        ctx.strokeStyle=fColor;
        ctx.lineWidth=2;
        var PlotRepeat,PlotRepeatI;
        if(Array.isArray(expression[fI].evalF)){
            PlotRepeat=expression[fI].evalF.length;
        }
        else {
            PlotRepeat=1;
        }
        var discon,disconNext,Yout,isPM;
        var isPM=PlotRepeat-1;
        var x0,x,x1,x2,y0,y,y1,y2,X;
        for(PlotRepeatI=0;PlotRepeatI<PlotRepeat;PlotRepeatI++){
            ctx.beginPath();
            discon=0;
            disconNext=0;
            Yout=0;
            
            // To get discontinuity 
            /*
             * y0 -> previous y
             * y -> current
             * y1 -> next
             * y2 -> next to next
             * 
             * same for x
             * 
             * */
            // y at X=0
            x1=(-origX)/scaleX;
            y1=evalGetY(fI,isPM,PlotRepeatI,x1);
            // y at X=1
            x2=(1-origX)/scaleX;
            y2=evalGetY(fI,isPM,PlotRepeatI,x2);
            // To get discontinuity 

            for(X=0;X<=cW;X++){
                // To get discontinuity 
                if(X){
                    x0=x;
                    y0=y;
                }
                x=x1;
                y=y1;
                x1=x2;
                y1=y2;
                x2=((X+2)-origX)/scaleX;
                y2=evalGetY(fI,isPM,PlotRepeatI,x2);
                if(disconNext)discon=1;
                var disconResult=getDiscon({
                    'fI': fI,
                    'x0': x0,
                    'y0': y0,
                    'x': x,
                    'y': y,
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2,
                    'X': X,
                    'isPM': isPM,
                    'PlotRepeatI': PlotRepeatI,
                    'scaleX': scaleX,
                    'disconNext': disconNext,
                    'getValFunc': evalGetY
                });
                y=disconResult.y;
                y1=disconResult.y1;
                disconNext=disconResult.disconNext;
                // To get discontinuity Done
                
                if(y=='111er111'){
                    return 0;
                    break;
                }
                if(y==Number.POSITIVE_INFINITY){
                    y=rangeYend+1;discon=1;
                }
                else if(y==Number.NEGATIVE_INFINITY){
                    y=rangeYstart-1;discon=1;
                }
                else if(isNaN(y)){
                    discon=1;
                    continue;
                }
                else if(y>rangeYend+1){
                    y=rangeYend+1;
                    if(Yout!=0)discon=1;
                    else Yout=1;
                }
                else if(y<rangeYstart-1){
                    y=rangeYstart-1;
                    if(Yout!=0)discon=1;
                    else Yout=1;
                }
                else Yout=0;
                Y=origY-(y*scaleY);
                if(X==0 || discon==1){
                    if(isValidNo(Y))ctx.moveTo(X,Y);
                    discon=0;
                }
                else {
                    ctx.lineTo(X,Y);
                }
            }
            ctx.stroke();
        }
    }
    var plotFuncY=function(fI){
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        var fColor=expression[fI].color;
        ctx.strokeStyle=fColor;
        ctx.lineWidth=2;
        
        var PlotRepeat,PlotRepeatI;
        if(Array.isArray(expression[fI].evalF)){
            PlotRepeat=expression[fI].evalF.length;
        }
        else {
            PlotRepeat=1;
        }
        var discon,disconNext,Xout,isPM;
        var isPM=PlotRepeat-1;
        var x0,x,x1,x2,y0,y,y1,y2,X;
        for(PlotRepeatI=0;PlotRepeatI<PlotRepeat;PlotRepeatI++){
            ctx.beginPath();
            discon=0;
            disconNext=0;
            Xout=0;
            
            // To get discontinuity 
            var cosAngleCurr,cosAngleNext,vectY,vectYval,vect1X,vect2X;
            var maxX,minX,maxEndY,minEndY,inc0,int1,dec0,dec1,inc,dec,xTemp,xTempLast;
            var incLast,decLast,initInc,initDec,endInc,endDec,directionChangeCount,directionChangeFreq;
            var directionChangeCount,initDirection;
            vectY=1/scaleY;
            vectYval=vectY*vectY;
            /*
             * x0 -> previous x
             * x -> current
             * x1 -> next
             * x2 -> next to next
             * 
             * same for y
             * 
             * */
            // x at Y=0
            y1=origY/scaleY;
            x1=evalGetX(fI,isPM,PlotRepeatI,y1);
            // x at Y=1
            y2=(origY-1)/scaleY;
            x2=evalGetX(fI,isPM,PlotRepeatI,y2);
            // To get discontinuity 

            for(Y=0;Y<=cH;Y++){
                // To get discontinuity 
                if(Y){
                    x0=x;
                    y0=y;
                }
                x=x1;
                y=y1;
                x1=x2;
                y1=y2;
                y2=(origY-(Y+2))/scaleY;
                x2=evalGetX(fI,isPM,PlotRepeatI,y2);
                if(disconNext)discon=1;
                disconSuspect=0;
                var disconResult=getDiscon({
                    'fI': fI,
                    'x0': y0,
                    'y0': x0,
                    'x': y,
                    'y': x,
                    'x1': y1,
                    'y1': x1,
                    'x2': y2,
                    'y2': x2,
                    'X': Y,
                    'isPM': isPM,
                    'PlotRepeatI': PlotRepeatI,
                    'scaleX': scaleY,
                    'disconNext': disconNext,
                    'getValFunc': evalGetX
                });
                x=disconResult.y;
                x1=disconResult.y1;
                disconNext=disconResult.disconNext;
                // To get discontinuity Done
                
                if(x=='111er111'){
                    return 0;
                    break;
                }
                if(x==Number.POSITIVE_INFINITY){
                    x=rangeYend+1;discon=1;
                }
                else if(x==Number.NEGATIVE_INFINITY){
                    x=rangeYstart-1;discon=1;
                }
                else if(isNaN(x)){
                    discon=1;
                    continue;
                }
                else if(x>rangeXend+1){
                    x=rangeXend+1;
                    if(Xout!=0)discon=1;
                    else Xout=1;
                }
                else if(x<rangeXstart-1){
                    x=rangeXstart-1;
                    if(Xout!=0)discon=1;
                    else Xout=1;
                }
                else Xout=0;
                X=origX+(x*scaleX);
                if(Y==0 || discon==1){
                    ctx.moveTo(X,Y);////////////////
                    discon=0;
                }
                else {
                    ctx.lineTo(X,Y);
                }
            }
            ctx.stroke();
        }
    }
    var plotTable=function(fI,mode){
        /* mode
         * 0-->plot points
         * 1-->plot linegraph
         */
        if(typeof mode == 'undefined')mode=0;
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        var fColor=expression[fI].color;
        ctx.strokeStyle=fColor;
        ctx.fillStyle=fColor;
        ctx.lineWidth=2;
        var X,Y,pointI;
        var pi=Math.PI;
        for(pointI=0;pointI<expression[fI].evalF.length;pointI++){
            x=expression[fI].evalF[pointI][0];
            y=expression[fI].evalF[pointI][1];
            //if(x<rangeXstart-1 || x>rangeXend+1 || y<rangeYstart-1 || y>rangeXend+1)continue;
            X=origX+(x*scaleX);
            Y=origY-(y*scaleY);
            if(mode==1 && pointI){
                ctx.lineTo(X,Y);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(X,Y,5,0,2*pi);
            ctx.fill();
            if(mode==1){
                ctx.beginPath();
                ctx.moveTo(X,Y);
            }
        }
    }
    var plotPolar=function(fI){
        var c=document.getElementById('ugraph');
        var ctx=c.getContext('2d');
        var fColor=expression[fI].color;
        ctx.strokeStyle=fColor;
        ctx.lineWidth=2;
        var PlotRepeat,PlotRepeatI;
        if(Array.isArray(expression[fI].evalF)){
            PlotRepeat=expression[fI].evalF.length;
        }
        else {
            PlotRepeat=1;
        }
        var discon,disconNext,Yout,isPM;
        var isPM=PlotRepeat-1;
        var scaleTheta=1000;
        var t0,t,t1,t2,r0,r,r1,r2,T;
        var x,y,X,Y,Yout;
        for(PlotRepeatI=0;PlotRepeatI<PlotRepeat;PlotRepeatI++){
            ctx.beginPath();
            discon=0;
            disconNext=0;
            Yout=0;
            
            // To get discontinuity 
            /*
             * y0 -> previous y
             * y -> current
             * y1 -> next
             * y2 -> next to next
             * 
             * same for x
             * 
             * */
            // y at X=0
                
            t1=0;
            r1=evalGetR(fI,isPM,PlotRepeatI,t1);
            // y at X=1
            t2=1/scaleTheta;
            r2=evalGetR(fI,isPM,PlotRepeatI,t2);
            // To get discontinuity 
            
            var tLim=(2*Math.PI*scaleTheta);
            for(T=0;T<=tLim;T++){
                // To get discontinuity 
                if(T){
                    t0=t;
                    r0=r;
                }
                t=t1;
                r=r1;
                t1=t2;
                r1=r2;
                t2=(T+2)/scaleTheta;
                r2=evalGetR(fI,isPM,PlotRepeatI,t2);
                if(disconNext)discon=1;
                var disconResult=getDiscon({
                    'fI': fI,
                    'x0': t0,
                    'y0': r0,
                    'x': t,
                    'y': r,
                    'x1': t1,
                    'y1': r1,
                    'x2': t2,
                    'y2': r2,
                    'X': T,
                    'isPM': isPM,
                    'PlotRepeatI': PlotRepeatI,
                    'scaleX': scaleTheta,
                    'disconNext': disconNext,
                    'getValFunc': evalGetR
                });
                r=disconResult.y;
                r1=disconResult.y1;
                disconNext=disconResult.disconNext;
                // To get discontinuity Done
                
                y=r*Math.sin(t);
                x=r*Math.cos(t);
                X=(x*scaleX)+origX;
                if(y=='111er111'){
                    return 0;
                    break;
                }
                if(y==Number.POSITIVE_INFINITY){
                    y=rangeYend+1;discon=1;
                }
                else if(y==Number.NEGATIVE_INFINITY){
                    y=rangeYstart-1;discon=1;
                }
                else if(isNaN(y)){
                    discon=1;
                    continue;
                }
                else if(y>rangeYend+1){
                    //y=rangeYend+1;
                    if(Yout!=0)discon=1;
                    else Yout=1;
                }
                else if(y<rangeYstart-1){
                    //y=rangeYstart-1;
                    if(Yout!=0)discon=1;
                    else Yout=1;
                }
                else Yout=0;
                Y=origY-(y*scaleY);
                if(X==0 || discon==1){
                    if(isValidNo(Y))ctx.moveTo(X,Y);
                    discon=0;
                }
                else {
                    ctx.lineTo(X,Y);
                }
            }
            ctx.stroke();
        }
    }
    
    //4. Other Utilities and Supplementary functions
    var canXorig,canYorig,canXend,canYend,origXorig,origYorig,canX,canY;
    var canvasMdown=function(ev){
        if(ev.button!=0)return;
        var c=document.getElementById('ugraphHelp');
        var rect=c.getBoundingClientRect();
        origXorig=origX;
        origYorig=origY;
        canXorig=ev.clientX-rect.left;
        canYorig=ev.clientY-rect.top;
        c.addEventListener('mousemove',canvasMmove,true);
        c.addEventListener('mouseup',canvasMup,false);
        c.addEventListener('mouseout',canvasMup,false);
    }
    var canvasMmove=function(ev){
        var c=document.getElementById('ugraphHelp');
        var rect=c.getBoundingClientRect();
        canXend=ev.clientX-rect.left;
        canYend=ev.clientY-rect.top;
        origX=origXorig+canXend-canXorig;
        origY=origYorig+canYend-canYorig;
        prepareg();
        plotFunc();
    }
    var canvasMup=function(ev){
        var c=document.getElementById('ugraphHelp');
        var rect=c.getBoundingClientRect();
        canXend=ev.clientX-rect.left;
        canYend=ev.clientY-rect.top;
        c.removeEventListener('mousemove',canvasMmove,true);
        c.removeEventListener('mouseup',canvasMup,false);
        c.removeEventListener('mouseout',canvasMup,false);
        origX=origXorig+canXend-canXorig;
        origY=origYorig+canYend-canYorig;
        prepareg();
        plotFunc();
    }
    var canvasMover=function(ev){
        var c=document.getElementById('ugraphHelp');
        c.addEventListener('mousewheel',canvasMscroll,false);
        c.addEventListener('DOMMouseScroll',canvasMscroll,false);//firefox
        c.addEventListener('mousemove',canvasMUpmove,true);
        c.addEventListener('mouseout',canvasMout,true);
    }
    var canvasMUpmove=function(ev){
        if(plotting)return 0;
        var c=document.getElementById('ugraphHelp');
        var ctx=c.getContext('2d');
        var rect=c.getBoundingClientRect();
        canX=ev.clientX-rect.left;
        canY=ev.clientY-rect.top;
        ctx.clearRect(0,0,cW,cH);
        //For trackball
        if(trackBall){
            var fI,PlotRepeat,isPM,PlotRepeatI,Y,y,xT,X,x,yT;
            for(fI=0;fI<expression.length;fI++){
                if(expression[fI].evalF!='000er000'){
                    var fColor=expression[fI].color;
                    ctx.fillStyle=fColor;
                    if(Array.isArray(expression[fI].evalF)){
                        PlotRepeat=expression[fI].evalF.length;
                    }
                    else {
                        PlotRepeat=1;
                    }
                    isPM=PlotRepeat-1;
                    for(PlotRepeatI=0;PlotRepeatI<PlotRepeat;PlotRepeatI++){
                        if(expression[fI].equal==0){
                            ctx.beginPath();
                            X=canX;
                            x=(X-origX)/scaleX;
                            yT=evalGetY(fI,isPM,PlotRepeatI,x);
                            if(yT=='111er111'){
                                return 0;
                                break;
                            }
                            if(!(yT==Number.POSITIVE_INFINITY || yT==Number.NEGATIVE_INFINITY || isNaN(yT) || yT>rangeYend+1 || yT<rangeYstart-1)){
                                Y=origY-(yT*scaleY);
                                ctx.arc(X,Y,5,0,2*Math.PI);
                                ctx.fill();
                            }
                        }
                        else if(expression[fI].equal==1){
                            ctx.beginPath();
                            Y=canY;
                            y=(origY-Y)/scaleY;
                            xT=evalGetX(fI,isPM,PlotRepeatI,y);
                            if(xT=='111er111'){
                                return 0;
                                break;
                            }
                            if(!(xT==Number.POSITIVE_INFINITY || xT==Number.NEGATIVE_INFINITY || isNaN(xT) || xT>rangeYend+1 || xT<rangeYstart-1)){
                                X=origX+(xT*scaleX);
                                ctx.arc(X,Y,5,0,2*Math.PI);
                                ctx.fill();
                            }
                        }
                    }
                }
            }
            ctx.strokeStyle='blue';
        }
        //For trackball Done
        //For Coordinate tracker
        if(coTracker){
            var fI,y,nFactor,X,x,origFillStyle,fColor,leftMarg;
            y=new Array();
            for(fI=0;fI<expression.length;fI++){    //If anyone has PlusMinus
                if(Array.isArray(expression[fI].evalF))return 0;
            }
            for(fI=0;fI<expression.length;fI++){    //If anyone is not y=something : FIXME : Find better solution
                if(expression[fI].equal)return 0;
            }
            nFactor=0;
            var nonEmptyF=new Array();
            X=canX;
            x=(X-origX)/scaleX;
            for(fI=0;fI<expression.length;fI++){
                if(expression[fI].evalF!='000er000'){
                    y[fI]=evalGetY(fI,0,0,x);
                    if(y[fI]=='111er111')return 0;
                    if(isNaN(y[fI]))y[fI]='Undefined';//FIXME: Goes out of screen after 10 curves
                    else y[fI]=toDigit(y[fI],6);
                    nonEmptyF[nFactor]=fI;
                    nFactor++;
                }
                else{
                    y[fI]="";
                }
            }
            x=toDigit(x,6);
            if(!nFactor)return 0;
            if((nFactor*20)>cH)return 0;
            origFillStyle=ctx.fillStyle;
            ctx.fillStyle='white';
            ctx.fillRect(cW-171,1,171,(nFactor*20)+1);
            ctx.fillStyle=origFillStyle;
            ctx.lineWidth=0.2;
            ctx.beginPath();
            ctx.moveTo(cW-170,0);
            ctx.lineTo(cW-170,nFactor*20);
            ctx.moveTo(cW-90,0);
            ctx.lineTo(cW-90,nFactor*20);
            ctx.moveTo(cW-170,nFactor*20);
            ctx.lineTo(cW-90,nFactor*20);
            ctx.stroke();
            ctx.font="10pt Georgia";
            ctx.fillStyle='blue';
            ctx.fillText('x: '+x,cW-165,(nFactor*10)+3);
            ctx.fillStyle='black';
            for(fI=0;fI<nFactor;fI++){
                ctx.beginPath();
                ctx.moveTo(cW-90,(fI+1)*20);
                ctx.lineTo(cW,(fI+1)*20);
                ctx.stroke();
                ctx.font="10pt Georgia";
                var fColor=expression[nonEmptyF[fI]].color;
                ctx.fillStyle=fColor;
                ctx.fillText('y',cW-85,((fI+1)*20)-7);
                leftMarg=ctx.measureText('y').width-1;
                ctx.font="8pt Georgia";
                ctx.textBaseline="bottom";
                ctx.fillText(nonEmptyF[fI]+1,cW-85+leftMarg,((fI+1)*20)-2);
                leftMarg+=ctx.measureText(nonEmptyF[fI]+1).width;
                ctx.font="10pt Georgia";
                ctx.textBaseline="alphabetic";
                ctx.fillText(': '+y[nonEmptyF[fI]],cW-85+leftMarg+1,((fI+1)*20)-7);
                ctx.fillStyle='black';
            }
        }
        //For Coordinate tracker Done
    }
    var canvasMscroll=function(ev){
        ev.preventDefault();
        if(ev.wheelDelta)zoomScroll=-ev.wheelDelta;
        else zoomScroll=ev.detail*40;
        var zoom=zoomScroll/90;
        zoomAxis(zoom);
    }
    var canvasMout=function(ev){
        var c=document.getElementById('ugraphHelp');
        c.removeEventListener('mousewheel',canvasMscroll,false);
        c.removeEventListener('DOMMouseScroll',canvasMscroll,false);//firefox
        c.removeEventListener('mousemove',canvasMUpmove,true);
        c.removeEventListener('mouseout',canvasMout,true);
        preparegHelp();
    }
    var getBestColor=function(){
        //Returns least used color to use in next function
        var minUsed=fColorUsed[0];
        var minUsedId=0;
        var gbcI;
        for(gbcI=0;gbcI<fColorList.length;gbcI++){
            if(fColorUsed[gbcI]<minUsed){
                minUsed=fColorUsed[gbcI];
                minUsedId=gbcI;
            }
        }
        fColorUsed[minUsedId]++;
        return minUsedId;
    }
    var setColor=function(index, color){
        //Function to set color without interface
        if(fColorList.indexOf(expression[index].color) > -1)
            fColorUsed[fColorList.indexOf(expression[index].color)]--;
        if(fColorList.indexOf(color) > -1)
            fColorUsed[color]++;
        expression[index].color=color;
        prepareg();
        plotFunc();
    }
    
    var formatMenu=function(id){
        return [
            {
                type: 'main',
                id: 'expr',
                title: 'Expression', //Name of menu
                icon: 'fa-gear', //Font awesome icon name
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
                                currState: expression[id].color,
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
        var id=expression.length;
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
        expression[id]={};
        expression[id].color=fColorList[getBestColor()];
        wholeHumanFunctionControll('',id);
        
        input.change(function(ev){
            var id=$(this).attr('id').substr(4);
            expression[id]={
                color:expression[id].color,
            }
            wholeHumanFunctionControll($(this).val(),id);
            var add=1;
            for(var i=0;i<expression.length;i++){
                if(expression[i].evalF=='000er000'){
                    add=0;
                }
            }
            if(add)addF();
            prepareg();
            plotFunc();
        });
        
        input.focus(function(ev){
            var id=$(this).attr('id').substr(4);
            
            $('#exprDis'+id).hide();
            $(this).show();
            
            $('.expr.active').removeClass('active');
            $(this).closest('.expr').addClass('active');
            Base.updateMenu(defaultMenu.concat(formatMenu(id)));
            Base.focusMenu('expr');
        });
        
        input.blur(function(ev){
            var id=$(this).attr('id').substr(4);
            if( expression[id] && expression[id].humanF ){
                $(this).hide();
                $('#exprDis'+id).html('<span class="math">$'+expression[id].humanF+'$</span>');
                $('#exprDis'+id).show();
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#exprDis'+id).get(0)]);
            }
        });
        
        input.focus();
    }
    
    var remF=function(id){
        //$('.expr-no')
        if(fColorList.indexOf(expression[id].color) > -1)
            fColorUsed[fColorList.indexOf(expression[id].color)]--;
        expression.splice(id,1);
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
        //Base.updateMenu(defaultMenu);
        //Base.focusMenu('settings');
        prepareg()
        plotFunc();
    }
    
    var axisToZoom=function(mode,onoff){
        if(onoff==false)return;
        if(mode=='both'){
            zoomX=1;
            zoomY=1;
        }
        else if(mode=='x'){
            zoomX=1;
            zoomY=0;
        }
        else if(mode=='y'){
            zoomX=0;
            zoomY=1;
        }
    }
    var graphParent;
    var editable;
    
    this.depends = ['MathJax'];
    this.init=function(parent){
        //Using jQuery
        var side = $('<div class="sidebar" id="sidebar"></div>').appendTo(parent);
        
        graphParent=$('<div id="graphContain">').appendTo(parent);
        $('<canvas id="ugraph">Your browser does not support the HTML5 canvas tag.</canvas>').appendTo(graphParent);
        var can=$('<canvas id="ugraphHelp" ></canvas>').appendTo(graphParent);
        can.mousedown(canvasMdown);
        can.mouseover(canvasMover);
        
        graphParent.bind('click',function(){
            Base.updateMenu(defaultMenu);
            Base.focusMenu('settings');
            //$('.expr.active').removeClass('active');
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
        
        addF();
        
        this.resize();
    }
    
    var defaultMenu = [
        {
            type: 'main',
            id: 'settings',
            title: 'Graph', //Name of menu
            icon: 'fa-gears', //Font awesome icon name
            groups: [
                {
                    type: 'group',
                    id: 'zoom',
                    items: [
                        {
                            type: 'button',
                            icon: 'fa-search-plus',
                            id: '1.5',
                            callback: zoomAxis
                        },
                        {
                            type: 'button',
                            icon: 'fa-search-minus',
                            id: '-1.5',
                            callback: zoomAxis
                        },
                        {
                            type: 'button',
                            icon: 'fa-undo',
                            id: 'reset',
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
                            onoff: true,
                            currState: true,
                            callback: axisToZoom
                        },
                        {
                            type: 'button',
                            icon: 'fa-arrows-h',
                            id: 'x',
                            onoff: true,
                            callback: axisToZoom
                        },
                        {
                            type: 'button',
                            icon: 'fa-arrows-v',
                            id: 'y',
                            onoff: true,
                            callback: axisToZoom
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
        var origXMulti=origX/cW;
        var origYMulti=origY/cH;
        cW=graphParent.innerWidth();
        cH=graphParent.innerHeight();
        origX=cW*origXMulti;
        origY=cH*origYMulti;
        setCan();
        prepareg();
        plotFunc();
    }
    
})();

module=Aalekhan;
