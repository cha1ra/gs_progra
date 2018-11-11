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
        const codes = this.gmv.getCodes().split('\n');
        codes.forEach((el, i) => {
            //console.log(el);
            // try{
                this.gmv.appendText(this.gmm.translateToText(el, i));
            // }
            // catch(e){
            //     console.log('!-------エラーだってよ--------!');
            // }
        });
        console.log('result')
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