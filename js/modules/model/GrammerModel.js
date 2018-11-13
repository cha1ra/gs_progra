import VariableModel from "./VariableModel.js";

export class GrammerModel{
    constructor(props){
        // this.codes = props.codes;
        // this.code = this.codes; //複数行にするまでの繋ぎ

        this.init();
    }
    init(){
        this.variableObj = {};
        this.functionObj = {};
        this.controlStatements = [];
        this.layerNumber;
        this.isCommentFlag = false;
    }

    /*----------------------------------
    Define Function Position
    ----------------------------------*/
    defineFunctionPos(code, lineNum){
        //function の予約語があるかどうかを調べる(始まる点を調べる)
        console.log(this.isResWdNameFuncExist(code), lineNum)
        //予約語があったらファンクションオブジェクトを生成する
        if(this.isResWdNameFuncExist(code)){
            //TODO: 変数に含まれているか、functionで定義されているかをつまびらかにするべし。
            //現在は頭にfuncitonがついていると言う前提で話を進める。
            //'function'と'('の間にある文字列を取得する
            console.log(this.getFuncName(code));
            this.functionObj[this.getFuncName(code)] = {
                startLineNum: lineNum,
                endLineNum: 0,
                // countRoundBracketStart: 0,
                // countBracketEnd: 0,
                arugument: '',
                countCurlyBracketStart: 0,
                countCurlyBraketEnd: 0,
            }
        }
        //引数を取得する。丸括弧の開始数、終了数が同数
        

        //functionとして定義されているものは情報を舐める。もしendlinenumが定義されていれば情報は全て揃っているとみなし、処理は行わない
        for(const key in this.functionObj){
            if(this.functionObj[key].endLineNum != 0) continue;
            //TODO: functionが書いてある行に()がある前提のコードになっている
            if(this.functionObj[key].argument == 0){
                this.functionObj[key].argument = code.slice(
                    code.indexOf('(') + 1,
                    code.lastIndexOf(')')
                )
            }
            console.log(this.functionObj[key].argument);

        }

        //functionが
        //それ以外の場所はMainとして行数を記録
        if(lineNum == 0){

        }
    }

    getFuncName(code){
        return this.removeSpace(code)
            .slice(
                code.indexOf('function') + 'function'.length, 
                code.indexOf('(') - 1
            );
    }

    isResWdNameFuncExist(code){
        return code.split(' ').some((el)=>{
            if(el.indexOf('function') != -1) return true;
        });
    }

    /*----------------------------------
    Boolean Function
    ----------------------------------*/
    
    isReservedWordsExist(code){
        for (let reservedWord in reservedWords){
            if(code.indexOf(reservedWord) == 0){//前方一致
                return reservedWord;
            }
        }
        return false;
    }
    
    isEqualExist(code){
        if(code.indexOf('='))return true;
        return false;
    }
    
    /*----------------------------------
    Grammer
    ----------------------------------*/

    translateToText(code, lineNum){
        var code = code.replace(/^\s*/,''); //先頭のスペースorタブを削除
        if(this.isComment(code))return `${code}</br>`;
        this.reservedWord = this.isReservedWordsExist(code);
        const outputText = this.translateByRules(this.reservedWord, code, lineNum);
        return outputText;
    }

    isComment(code){
        if(code.indexOf('*/') != -1){
            this.isCommentFlag = false;
            return true;
        }

        if(this.isCommentFlag)return true;

        switch(code.slice(0,2)){
            case '/*':
                this.isCommentFlag = true;
            case '//':
                return true;
        }
        
        return false;
    }


    translateByRules(reservedWord, code, lineNum){
        //console.log('reservedWord = ' + reservedWords[reservedWord]);
        const result = () => {
            if(reservedWord != false){ //予約語があった場合
                switch(reservedWords[reservedWord]){
                    case 'var':
                        return this.translateVariable(reservedWord, code, lineNum);
                        // break;
                    case 'ctrlsta':
                        //()の中身を読み取る
                        this.translateControlStatements(reservedWord, code, lineNum);
                        break;
                    default:
                        return '翻訳中...';
                }
            }else{ //予約語がなかった場合

                //イコールがあったら
                if(this.isEqualExist(code)){
                    return this.translateExpression(code, lineNum);
                }
                return '翻訳中...';
            }
        }
        return result();
    }

    translateControlStatements(reservedWord, code, lineNum){
        console.log(reservedWord + 'だよーん');
        switch(reservedWord){
            case 'if':
                this.controlStatements.push({
                    ctrlsta: 'if',
                    roundBracketsNum: 0,
                    roundBracketsVal: '',
                    curlyBracketsNum: 0,
                    curlyBracketsVal: ''
                })
                if('')
                console.log(this.controlStatements);


                break;
        }
        //layerNumを + 1する
        this.layerNumber++;

    }


    translateVariable(reservedWord, code, lineNum){
        const result = () =>{
            const operand = this.getEachOperand(code);
            const leftOpe = operand[0].slice(reservedWord.length,operand[0].length);
            const rightOpe = operand[1];
            //TODO: return を要素だけ返すようにする
            this.addVariable(leftOpe, code);

            return `<p class="line${lineNum+1}">変数<span>(${reservedWord}) ${leftOpe}</span> に <span>${rightOpe}</span> を代入します。</p>`
        }
        return result();
    }

    translateExpression(code, lineNum){
        //TODO: ;を取り除く処理ロジックを変更する
        code = code.slice(0,-1);
        switch (this.countEqualNum(code)){
            case 0:
                //比較演算子があるかどうかの判定が必要

                break;
            case 1:
                return this.calcExpression(code, lineNum);
                break;
            case 2:
            case 3:
                return this.calcConditionalExp(code);
                break;
        }
        return false;
    }

    //左辺に右辺を代入する系
    calcExpression(code, lineNum){
        //TODO: <=や+=を見極めるための簡単なテスト
        const beforeEqual = this.revealOperatorBeforeEqual(code)
        switch(beforeEqual){        
            case '>':
            case '<':
            case '!':
                return `<p>${eval(code)}</p>`
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                const thisVal = code.slice(0,code.indexOf(beforeEqual));
                code = code.replace(beforeEqual,'') + beforeEqual + thisVal;
            default:
                console.log('[値] = [値]');
                // A = a の場合
                console.log(code);
                const operand = this.getEachOperand(code);
                let leftOpe = operand[0];
                let rightOpe = operand[1];
                console.log(operand);
                //TODO: 変数を変更する系の処理をまとめる
                this.changeVariableVal(leftOpe, this.evalExpression(rightOpe));
                //console.log(this.variable);
                return `<p class="line${lineNum+1}"><span>${leftOpe}</span> に <span>${rightOpe}</span> を代入します。<br>
                その結果、${leftOpe}の値は<span>${this.variableObj[leftOpe]['val']}</span>になります</p>`

        }
        

        // A = function(){} の場合
        // A = () => の 場合
        // A = [a, b, c] の場合
        // A = {key: a} の場合

    }

    revealOperatorBeforeEqual(code){
        return code.split('')[code.indexOf('=') - 1];
    }


    calcConditionalExp(code){

    }

    evalExpression(exp){
        //変数があるかどうかの判定
        for(let key in this.variableObj){
            let reg = new RegExp(key, 'g'); //正規表現に変数をもちいる方法
            exp = exp.replace(reg,this.variableObj[key]['val']);
        }
        return eval(exp);
    }

    /**
    * @param {String} code オペランドを取り出したいコード
    * @return {Array}
    */
    getEachOperand(code){
        const result = () =>{
            var val = this.removeSpace(code).split('=');
            return val;
        };
        // console.log(code);
        // console.log(result());
        return result();
    }

    removeSpace(code){
        return code.replace(/\s/g,''); //全てのスペースを削除
    }

    countEqualNum(code){
        const eNum = code.split('=').length - 1; //イコールのカウントロジックを変更する
        //console.log('eNum = ' + eNum);
        if(eNum == null) return 0;
        else return eNum;
    }

    /*----------------------------------
    Variable
    ----------------------------------*/
    //変数・定数が宣言されているときに
    addVariable(varName, code){
        console.log('変数を代入');
        console.log(varName,code);
        const value = this.evalVariable(varName,code);
        this.variableObj[varName] = {
            val: value,
            type: typeof value
        }
        console.log('!!------------!!');
        console.log(this.variableObj[varName].val);
        console.log(this.variableObj[varName].type);
    }

    changeVariableVal(varName, val){
        this.variableObj[varName]['val'] = val;
        return false;
    }

    evalVariable(varName, code){
        return new Function(`${code} return ${varName}`)();
    }

    get variableObj(){return this._variableObj;}
    set variableObj(v){this._variableObj = v;}
    get layerNumber(){return this._layerNumber;}
    set layerNumber(v){this._layerNumber = v;}

}

export default GrammerModel