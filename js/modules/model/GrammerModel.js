export class GrammerModel{
    constructor(props){
        // this.codes = props.codes;
        // this.code = this.codes; //複数行にするまでの繋ぎ

        this.init();
    }
    init(){

    }
    
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
        console.log(code);
        const operand = this.getEachOperand(code);
        let leftOpe = operand[0];
        let rightOpe = operand[1];
        console.log(operand);
        return `<p class="line${lineNum+1}">${leftOpe} に ${rightOpe} を代入します。<br>
        その結果、${leftOpe}の値は${eval(rightOpe)}になります</p>`

        // A = a + b の場合

        // A += a の場合

        // A = function(){} の場合
        // A = () => の 場合
        // A = [a, b, c] の場合
        // A = {key: a} の場合

    }

    calcConditionalExp(code){

    }

    /**
    * @param {String} code オペランドを取り出したいコード
    * @return {Array}
    */
    getEachOperand(code){
        const result = () =>{
            var val = this.removeSpace(code).split('=');
            val[1] = val[1].slice(0,-1);
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
}

export default GrammerModel