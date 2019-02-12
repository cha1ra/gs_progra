import VariableModel from './VariableModel.js'

export class GrammerModel {
  constructor (props) {
    // this.codes = props.codes;
    // this.code = this.codes; //複数行にするまでの繋ぎ

    this.init()
  }
  init () {
    this.mainLineNum = []
    this.variableObj = {}
    this.functionObj = {}
    this.controlStatements = []
    this.layerNumber
    this.isCommentFlag = false
    this.translatorUrl = 'https://script.google.com/macros/s/AKfycbwTwAqaxRH-JzmeARtDhk1VXtYS3ERO1I1OPhXuLSPf4iRGhxM/exec'
    this.locale
  }

  /* ----------------------------------
    Translator
    ---------------------------------- */
  adjustFuncNameToText (funcName) {
    funcName = funcName.split(/([A-Z][a-z]*)/).filter((el) => {
      if (el == '' || el == undefined) return false
      return true
    })
    funcName.forEach((el, i) => {
      // Topは大文字、それ以外は小文字に
      if (i == 0) {
        funcName[i] = el.charAt(0).toUpperCase() + el.slice(1)
      } else {
        funcName[i] = el.charAt(0).toLowerCase() + el.slice(1)
      }
    })
    funcName = funcName.join(' ')

    console.log(`関数 ${funcName} を翻訳します...`)
    return funcName
  }

  translateText (thisText, targetLang) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: './php/translation.php',
        data: {
          url: this.translatorUrl,
          text: thisText,
          source: 'en',
          target: targetLang
        }
      })
        .then(
          (data) => {
            return resolve(data)
          },
          (err) => {
            console.log('error: ')
            console.log(err)
            return reject(err)
          }
        )
    })
  }

  /* ----------------------------------
    Define Function Position
    ---------------------------------- */
  defineFunctionInfo (code, lineNum) {
    let isFunctionExist = false

    // function の予約語があるかどうかを調べる(始まる点を調べる)
    // 予約語があったらファンクションオブジェクトを生成する
    if (this.isResWdNameFuncExist(code)) {
      // FIXME: 変数に含まれているか、functionで定義されているかをつまびらかにするべし。
      // 現在は頭にfuncitonがついていると言う前提で話を進める。
      // 'function'と'('の間にある文字列を取得する
      console.log(`関数 ${this.getFuncName(code)} を発見しました。`)
      this.functionObj[this.getFuncName(code)] = {
        startLineNum: lineNum,
        endLineNum: 0,
        // countRoundBracketStart: 0,
        // countBracketEnd: 0,
        argument: '',
        countCurlyBracketStart: 0,
        countCurlyBracketEnd: 0,
        returnValue: ''
      }
    }

    // functionとして定義されているものは情報を舐める。もしendlinenumが定義されていれば情報は全て揃っているとみなし、処理は行わない
    for (const key in this.functionObj) {
      if (this.functionObj[key].endLineNum != 0) {
        continue
      } else {
        // 引数の取得
        // FIXME: functionが書いてある行に()がある前提のコードになっている
        if (this.functionObj[key].argument == 0) {
          this.functionObj[key].argument = this.getRoundBracket(code).split(',')
        }

        // {と}の数の分だけカウンターを上下
        this.functionObj[key].countCurlyBracketStart += this.countValNum(code, '{')
        this.functionObj[key].countCurlyBracketEnd += this.countValNum(code, '}')

        if (
          this.functionObj[key].countCurlyBracketEnd != 0 &&
                    (this.functionObj[key].countCurlyBracketStart == this.functionObj[key].countCurlyBracketEnd)
        ) {
          this.functionObj[key].endLineNum = lineNum
          console.log(`${key} の情報取得が完了しました。`)
          console.log(this.functionObj[key])
        }

        // return文があったら変化する。

        isFunctionExist = true
        // console.log(this.functionObj);
      }
    }

    // functionじゃない場所をmainとして行数を取得
    if (!isFunctionExist) {
      this.mainLineNum.push(lineNum)
    }

    // console.log(this.mainLineNum);
  }

  getFuncName (code) {
    return this.removeSpace(code)
      .slice(
        code.indexOf('function') + 'function'.length,
        code.indexOf('(') - 1
      )
  }

  isResWdNameFuncExist (code) {
    return code.split(' ').some((el) => {
      if (el.indexOf('function') != -1) return true
    })
  }

  getRoundBracket (code) {
    return code.slice(
      code.indexOf('(') + 1,
      code.lastIndexOf(')')
    )
  }

  /* ----------------------------------
    Define CurlyBracket Information
    ---------------------------------- */
  defineCurlyBracketInfo (code, lineNum) {
    this.reservedWord = this.isReservedWordsExist(code)
    console.log(this.reservedWord)
    switch (this.reservedWord) {
      case 'else':
      case 'if':
      case 'while':
      case 'for':
        this.controlStatements.push({
          ctrlsta: this.reservedWord,
          startLineNum: lineNum,
          endLineNum: 0,
          condSentence: this.getRoundBracket(code), // FIXME: 先頭行に()がある前提のコードになっている
          countCurlyBracketStart: 0,
          countCurlyBracketEnd: 0
        })
        break
      default:
        break
    }
    this.controlStatements.forEach((el, i) => {
      if (el.endLineNum != 0) {
        return false
      } else {
        // {と}の数の分だけカウンターを上下
        this.controlStatements[i].countCurlyBracketStart += this.countValNum(code, '{')
        this.controlStatements[i].countCurlyBracketEnd += this.countValNum(code, '}')

        if (
          this.controlStatements[i].countCurlyBracketEnd != 0 &&
                    (this.controlStatements[i].countCurlyBracketStart == this.controlStatements[i].countCurlyBracketEnd)
        ) {
          this.controlStatements[i].endLineNum = lineNum
          console.log(`${el.ctrlsta} の情報取得が完了しました。`)
          console.log(this.controlStatements[i])
        }
        // console.log(this.functionObj);
      }
    })
    console.log('fin')
    console.log(this.controlStatements)
  }

  /* ----------------------------------
    Boolean Function
    ---------------------------------- */

  isReservedWordsExist (code) {
    for (let reservedWord in reservedWords) {
      if (code.indexOf(reservedWord) == 0) { // 前方一致
        return reservedWord
      }
    }
    return false
  }

  isEqualExist (code) {
    if (code.indexOf('=')) return true
    return false
  }

  /* ----------------------------------
    Grammer
    ---------------------------------- */

  translateToText (code, lineNum) {
    var code = code.replace(/^\s*/, '') // 先頭のスペースorタブを削除
    console.log(`処理対象コード:\n${code}`)
    if (this.isComment(code)) {
      console.log('これはコメント文です。')
      return `${code}</br>`
    };
    this.reservedWord = this.isReservedWordsExist(code)
    const outputText = this.translateByRules(this.reservedWord, code, lineNum)
    return outputText
  }

  isComment (code) {
    if (code.indexOf('*/') != -1) {
      this.isCommentFlag = false
      return true
    }

    if (this.isCommentFlag) return true

    switch (code.slice(0, 2)) {
      case '/*':
        this.isCommentFlag = true
      case '//':
        return true
    }

    return false
  }

  translateByRules (reservedWord, code, lineNum) {
    // console.log('reservedWord = ' + reservedWords[reservedWord]);
    const result = () => {
      if (reservedWord != false) { // 予約語があった場合
        switch (reservedWords[reservedWord]) {
          case 'var':
            return this.translateVariable(reservedWord, code, lineNum)
            // break;
          case 'ctrlsta':
            // ()の中身を読み取る
            // this.translateControlStatements(reservedWord, code, lineNum);
            break
          default:
            return '翻訳中...'
        }
      } else { // 予約語がなかった場合
        // イコールがあったら
        if (this.isEqualExist(code)) {
          return this.translateExpression(code, lineNum)
        }
        return '翻訳中...'
      }
    }
    return result()
  }

  translateControlStatements (reservedWord, code, lineNum) {
    console.log(reservedWord + 'だよーん')
    switch (reservedWord) {
      case 'if':
        // this.controlStatements.push({
        //     ctrlsta: 'if',
        //     roundBracketsNum: 0,
        //     roundBracketsVal: '',
        //     curlyBracketsNum: 0,
        //     curlyBracketsVal: ''
        // })
        if ('') { console.log(this.controlStatements) }

        break
    }
    // layerNumを + 1する
    this.layerNumber++
  }

  translateVariable (reservedWord, code, lineNum) {
    const result = () => {
      const operand = this.getEachOperand(code)
      const leftOpe = operand[0].slice(reservedWord.length, operand[0].length)
      const rightOpe = operand[1]
      // TODO: return を要素だけ返すようにする
      this.addVariable(leftOpe, code)

      return eval('`' + localization.translateVariable[this.locale] + '`')
      // return `<p class="line${lineNum+1}">${this.letOrConst(reservedWord)}<span>(${reservedWord}) ${leftOpe}</span> に <span>${rightOpe}</span> を代入します。</p>`
    }
    return result()
  }

  letOrConst (val) {
    if (val == 'const') {
      return localization.const[this.locale]
    } else {
      return localization.var[this.locale]
    }
  }

  translateExpression (code, lineNum) {
    // TODO: ;を取り除く処理ロジックを変更する
    code = code.slice(0, -1)
    switch (this.countValNum(code, '=')) {
      case 0:
        // 比較演算子があるかどうかの判定が必要

        break
      case 1:
        return this.calcExpression(code, lineNum)
        break
      case 2:
      case 3:
        return this.calcConditionalExp(code)
        break
    }
    return false
  }

  // 左辺に右辺を代入する系
  calcExpression (code, lineNum) {
    // TODO: <=や+=を見極めるための簡単なテスト
    const beforeEqual = this.revealOperatorBeforeEqual(code)
    switch (beforeEqual) {
      case '>':
      case '<':
      case '!':
        return `<p>${eval(code)}</p>`
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        const thisVal = code.slice(0, code.indexOf(beforeEqual))
        code = code.replace(beforeEqual, '') + beforeEqual + thisVal
      default:
        console.log('[値] = [値]')
        // A = a の場合
        console.log(code)
        const operand = this.getEachOperand(code)
        let leftOpe = operand[0]
        let rightOpe = operand[1]
        console.log(operand)
        // TODO: 変数を変更する系の処理をまとめる
        this.changeVariableVal(leftOpe, this.evalExpression(rightOpe))
        // console.log(this.variable);
        return eval('`' + localization.calcExpression[this.locale] + '`')
    }

    // A = function(){} の場合
    // A = () => の 場合
    // A = [a, b, c] の場合
    // A = {key: a} の場合
  }

  revealOperatorBeforeEqual (code) {
    return code.split('')[code.indexOf('=') - 1]
  }

  calcConditionalExp (code) {

  }

  evalExpression (exp) {
    // 変数があるかどうかの判定
    for (let key in this.variableObj) {
      let reg = new RegExp(key, 'g') // 正規表現に変数をもちいる方法
      exp = exp.replace(reg, this.variableObj[key]['val'])
    }
    return eval(exp)
  }

  /**
    * @param {String} code オペランドを取り出したいコード
    * @return {Array}
    */
  getEachOperand (code) {
    const result = () => {
      var val = this.removeSpace(code).split('=')
      return val
    }
    // console.log(code);
    // console.log(result());
    return result()
  }

  removeSpace (code) {
    return code.replace(/\s/g, '') // 全てのスペースを削除
  }

  countValNum (code, val) {
    const vNum = code.split(val).length - 1 // イコールのカウントロジックを変更する
    // console.log('eNum = ' + eNum);
    if (vNum == null) return 0
    else return vNum
  }

  /* ----------------------------------
    Variable
    ---------------------------------- */
  // 変数・定数が宣言されているときに
  addVariable (varName, code) {
    console.log('変数を代入')
    const value = this.evalVariable(varName, code)
    this.variableObj[varName] = {
      val: value,
      type: typeof value
    }
  }

  changeVariableVal (varName, val) {
    this.variableObj[varName]['val'] = val
    return false
  }

  evalVariable (varName, code) {
    return new Function(`${code} return ${varName}`)()
  }

  get variableObj () { return this._variableObj }
  set variableObj (v) { this._variableObj = v }
  get layerNumber () { return this._layerNumber }
  set layerNumber (v) { this._layerNumber = v }
  get functionObj () { return this._functionObj }
  set functionObj (v) { this._functionObj = v }
  get locale () { return this._locale }
  set locale (v) { this._locale = v }
  // functionObj
}

export default GrammerModel
