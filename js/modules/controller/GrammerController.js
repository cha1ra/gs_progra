import GrammerModel from "../model/GrammerModel.js";
import GrammerView from "../view/GrammerView.js"
import GraphicView from "../view/GraphicView.js"

export class TranslateController{
    constructor(props){
        console.log('props : ' + props.for);
        // this.codes = props;
        this.bindMethods();
        this.init();

        // const result = this.gm.translateToLanguage(this.codes);
        // this.gv.appendText(result);

        this.translateEachCords();
        

    }

    init(){
        this.gmv = new GrammerView({
            onSendCallBack: this.translateEachCords
        });
        this.gmm = new GrammerModel();
        this.gpv = new GraphicView({
            onSendCallback: this.drawCords
        });
        this.gmm.locale = 'ja'
    }

    bindMethods(){
        this.translateEachCords = this.translateEachCords.bind(this);
        this.drawCords = this.drawCords.bind(this);
    }


    /*----------------------------------
    Grammer Controller
    ----------------------------------*/

    translateEachCords(lang){
        this.initEachStatus();
        this.changeLocale(lang);
        const codes = this.gmv.getCodesArray();
        //TODO: レイヤー位置の決定

        console.log('[Message] 関数情報を取得します。=====');
        //関数があったらあらかじめ拾ってオブジェクトに格納する
        codes.forEach((el, i) => {
            this.gmm.defineFunctionInfo(el, i);
        });
        console.log('END\n\n');

        console.log('[Message] 制御構文の有無を確認します=====');
        //全体に制御構文がいくつあるか、どこにあるかをマークアップ
        codes.forEach((el, i) => {
            this.gmm.defineCurlyBracketInfo(el, i);
        });

        console.log('END\n\n');

        console.log('[Message] 実際の計算を開始します。=====');

        this.gmm.mainLineNum.forEach((el)=>{
            console.log(`- [開始]${el+1}行目の処理`);
            //定義済みの関数を発見したらその処理をループする
            for(const key in this.gmm.functionObj){
                if(codes[el].indexOf(key) != -1){
                    console.log(`関数${key}の処理を開始します`);
                    const start = this.gmm.functionObj[key].startLineNum;
                    const end = this.gmm.functionObj[key].endLineNum;
                    //代入処理が必要
                    //let resultHtml = `<div class='func'>関数 ${key} が出現！<br><span class='${key}'>関数内</span>の処理を始めます。<div>`;
                    let resultHtml = eval('`' + localization.functionText[this.gmm.locale] + '`');
                    const funcText = this.gmm.adjustFuncNameToText(key).replace(/\s/g,'%20');
                    
                    console.log(this.gmm.locale);
                    this.gmm.translateText(funcText,this.gmm.locale).then((val) => {
                        this.changeFunctionText(key, val);
                    })

                    //TODO: 再帰関数で記述する必要がある
                    for(let i=start; i<=end; i++){
                        console.log(`-- [開始]${i+1}行目の処理`);
                        resultHtml += this.gmm.translateToText(codes[i], i);
                        console.log(`-- [終了]${i+1}行目の処理`);
                    }
                    resultHtml += `</div></div>`;
                    this.gmv.appendText(resultHtml);
                }
            }
            this.gmv.appendText(this.gmm.translateToText(codes[el], el));
            console.log(`- [終了]${el+1}行目の処理`);
        })

        console.log('END\n\n');
        //TODO: 関数・変数オブジェクトの解放
        //現在把握しているところでは、関数・変数・mainの行

        console.log(`[Message] 描画処理の開始=====`);
        this.gpv.clearGraphicDiv();
        this.gpv.appendText('<h3>Value</h3>');
        this.gpv.appendVariable(this.gmm.variableObj);
        //this.gpv.appendText('<h3>Function</h3>');

    }

    changeFunctionText(key, text){
        this.gmv.changeFunctionText(key,text);
    }

    initEachStatus(){
        this.gmv.clearText();
        this.gmv.layerNumber = 0;
        this.gmm.mainLineNum = [];
        this.gmm.variableObj = {};
    }

    changeLocale(lang){
        if(lang != undefined){
            this.gmm.locale = lang;
            console.log(`[Message]Localeが${this.gmm.locale}に変更されました=====`);
        }
        return false;
    }
    
    /*----------------------------------
    Graphic Controller
    ----------------------------------*/

    drawCords(){
        this.gpv.appendVariable(this.gmm.variableObj);
    }

}

function debug(desc, ex){
    console.log('Debug :' + desc);
    console.log(ex);
}



export default TranslateController

/*
新しく学んだこと
let val = code.replace(/\s/g,'');
*/