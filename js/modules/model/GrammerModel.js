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


    translateToLanguage(code, lineNum){
        console.log(this.countEqualNum(code));
        var code = code.replace(/^\s*/,''); //先頭のスペースorタブを削除
        //console.log(inputCode);
        var outputText;
        this.reservedWord = this.isReservedWordsExist(code);
        outputText = this.switchTranslateRules(this.reservedWord, code, lineNum);
        return outputText;
    }

    switchTranslateRules(reservedWord, code, lineNum){
        console.log(reservedWord,code);
        var result;
        switch(reservedWords[reservedWord]){
            case 'variable':
                result = this.translateVariable(reservedWord, code, lineNum);
                break;
            case false:
                if(this.isEqualExist(code)){
                    result = this.translateExpression(code);
                }
                break;
        }
        return result;
    }

    translateVariable(reservedWord, code, lineNum){
        var result;
        const operand = this.removeSpace(code).split('=');
        const leftOpe = operand[0].slice(reservedWord.length,operand[0].length);
        const rightOpe = operand[1].replace(';','');
        result = `<p class="line${lineNum+1}">変数(${reservedWord}) ${leftOpe} に ${rightOpe} を代入します。</p>`
        return result;
    }

    translateExpression(code){


    }

    removeSpace(code){
        return code.replace(/\s/g,''); //全てのスペースを削除
    }

    countEqualNum(code){
        const eNum = code.split('=').length - 1; //イコールのカウントロジックを変更する
        console.log('eNum = ' + eNum);
        if(eNum == null) return 0;
        else return eNum.length;
    }
}

export default GrammerModel