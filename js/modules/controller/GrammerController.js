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
        this.gpv.appendVariable(this.gmm.variable);
        

    }

    init(){
        this.gmv = new GrammerView({
            onSendCallBack: this.translateEachCords
        });
        this.gmm = new GrammerModel();
        this.gpv = new GraphicView({
            onSendCallback: this.drawCords
        });
    }

    bindMethods(){
        this.translateEachCords = this.translateEachCords.bind(this);
        this.drawCords = this.drawCords.bind(this);
    }


    /*----------------------------------
    Grammer Controller
    ----------------------------------*/

    translateEachCords(){
        this.gmv.clearText();
        const codes = this.gmv.getCodesArray();
        this.gmv.layerNumber = 0;
        //TODO: レイヤー位置の決定

        console.log('[Message] 関数情報を取得します。=====');
        //関数があったらあらかじめ拾ってオブジェクトに格納する
        codes.forEach((el, i) => {
            //console.log(el, i);
            this.gmm.defineFunctionPos(el, i);
        });

        console.log('[Message] 制御構文の有無を確認します=====');
        //全体に制御構文がいくつあるか、どこにあるかをマークアップ

        console.log('[Message] 実際の計算を開始します。=====');

        this.gmm.mainLineNum.forEach((el)=>{
            console.log(`- [開始]${el+1}行目の処理`);
            //定義済みの関数を発見したらその処理をループする
            for(const key in this.gmm.functionObj){
                if(codes[el].indexOf(key) != -1){
                    console.log('ファンクションやでえ！');
                    const start = this.gmm.functionObj[key].startLineNum;
                    const end = this.gmm.functionObj[key].endLineNum;
                    //代入処理が必要
                    this.gmv.appendText(`<div class='func'><p>関数 ${key} が呼び出された！<br>処理を始めます。`);
                    for(let i=start; i<=end; i++){
                        this.gmv.appendText(this.gmm.translateToText(codes[el], el));
                    }
                    this.gmv.appendText('</div>');
                }
            }

            this.gmv.appendText(this.gmm.translateToText(codes[el], el));
            console.log(`- [終了]${el+1}行目の処理`);
        })

        console.log('[Message] 計算を終了します =====');
        //TODO: 関数・変数オブジェクトの解放
        //現在把握しているところでは、関数・変数・mainの行

    }


    /*----------------------------------
    Graphic Controller
    ----------------------------------*/

    drawCords(){
        this.gpv.appendVariable(this.gmm.variable);
    }

}


/*----------------------------------
ルール決め is 大事

while.if.for文があったら{}を一括りにする
;があったら一文とみなす

----------------------------------*/









function debug(desc, ex){
    console.log('Debug :' + desc);
    console.log(ex);
}






export default TranslateController

/*
新しく学んだこと
let val = code.replace(/\s/g,'');
*/