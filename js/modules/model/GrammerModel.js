import VariableModel from "./VariableModel.js";

export class GrammerModel{
    constructor(props){
        // this.codes = props.codes;
        // this.code = this.codes; //複数行にするまでの繋ぎ

        this.init();
    }
    init(){
        this.variable = {};
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
        //console.log(this.countEqualNum(code));
        var code = code.replace(/^\s*/,''); //先頭のスペースorタブを削除
        //console.log(code);
        var outputText;
        this.reservedWord = this.isReservedWordsExist(code);
        //console.log(this.reservedWord);
        outputText = this.translateByRules(this.reservedWord, code, lineNum);
        return outputText;
    }

    translateByRules(reservedWord, code, lineNum){
        //console.log('reservedWord = ' + reservedWord);
        const result = () => {
            if(reservedWord != false){ //予約語があった場合
                switch(reservedWords[reservedWord]){
                    case 'var':
                        return this.translateVariable(reservedWord, code, lineNum);
                        // break;
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

    translateVariable(reservedWord, code, lineNum){
        const result = () =>{
            const operand = this.getEachOperand(code);
            const leftOpe = operand[0].slice(reservedWord.length,operand[0].length);
            const rightOpe = operand[1];
            //TODO: return を要素だけ返すようにする
            this.addVariable(leftOpe, code);

            return `<p class="line${lineNum+1}">変数(${reservedWord}) ${leftOpe} に ${rightOpe} を代入します。</p>`
        }
        return result();
    }

    translateExpression(code, lineNum){
        switch (this.countEqualNum(code)){
            case 1:
                console.log('hit!');
                //論理演算子？

                //論理演算子じゃない時
                return this.calcExpression(code);
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
        console.log('Num = Num');
        // A = a の場合
        // console.log(code);
        const operand = this.getEachOperand(code);
        let leftOpe = operand[0];
        let rightOpe = operand[1];
        //console.log(operand);
        //TODO: 変数を変更する系の処理をまとめる
        this.changeVariableVal(leftOpe, this.evalExpression(rightOpe));
        //console.log(this.variable);
        return `<p class="line${lineNum+1}">${leftOpe} に ${rightOpe} を代入します。<br>
        その結果、${leftOpe}の値は${this.variable[leftOpe]['val']}になります</p>`


        // A += a の場合(NOT 論理演算子)
        // A != a の場合(論理演算子)
        

        // A = function(){} の場合
        // A = () => の 場合
        // A = [a, b, c] の場合
        // A = {key: a} の場合

    }

    isCodeLogicalOperatpr(code){

    }


    calcConditionalExp(code){

    }

    evalExpression(exp){
        console.log('ここで右辺に変数があったら代入処理をする');
        //変数があるかどうかの判定
        for(let key in this.variable){
            let reg = new RegExp(key, 'g'); //正規表現に変数をもちいる方法
            console.log(reg);
            exp = exp.replace(reg,this.variable[key]['val']);
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
            val[1] = val[1].slice(0,-1);//TODO: ;を取り除く処理の記述
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
        console.log(varName,code);
        console.log('変数を代入');
        const value = this.evalVariable(varName,code);
        this.variable[varName] = {
            val: value,
            type: typeof value
        }

        console.log('!!------------!!');
        console.log(this.variable[varName].val);
        console.log(this.variable[varName].type);
    }

    changeVariableVal(varName, val){
        this.variable[varName]['val'] = val;
        return false;
    }

    evalVariable(varName, code){
        return new Function(`${code} return ${varName}`)();
    }

    get variable(){return this._variable;}
    set variable(v){this._variable = v;}

}

export default GrammerModel