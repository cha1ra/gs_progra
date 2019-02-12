export class GrammerView {
  constructor (props) {
    // this.code = props.code;
    this.onSendCallBack = props.onSendCallBack
        //console.log(this.onSendCallBack);
        this.init()
    }

  init () {
    this.loadAceSettings()
        this.bindDomElement()
        this.handleEvents()
    }

  getEditorString () {

  }

  bindDomElement () {
    this.$grammer = $('#grammer')
        this.$localization = $('#localization>img')
    }

  handleEvents () {
    this.editor.getSession().on('change', (e) => {
      if (e.lines[0] == ';') {
        console.log('[Comment];の入力を検知=====')
                this.onSendCallBack()
                return false
            }
    })

        $(window).keydown((e) => {
      if (event.shiftKey) {
        if (e.keyCode == 13) {
          console.log('[Comment]Shift + Enterの入力を検知=====')
                    this.onSendCallBack()
                    return false
                }
      }
    })

    this.$localization.on('click', (e) => {
      const locale = e.target.alt
            $('.mypage').text(localization.htmlMyPage[locale])
            $('.about').text(localization.htmlAbout[locale])
            $('.login').text(localization.htmlLogin[locale])
            $('#logo').attr('src', './img/logo-nav-' + locale + '.png')
            $('#progra-title').attr('placeholder', localization.htmlPrograTitle[locale])
            $('.save-text').text(localization.htmlSaveText[locale])
            this.onSendCallBack(locale)
        })
  }

  clearText () {
    console.log('[Message]メッセージの内容を削除します=====')
    this.$grammer.empty()
    }

  appendText (text) {
    this.$grammer.append(text)
    }

  changeFunctionText (funcName, text) {
    $('.' + funcName).html(`「${text}」`)
    }

  loadAceSettings () {
    /*----------------------------------
        ACE API
        ---------------------------------- */

    this.editor = ace.edit('editor')
        this.editor.setTheme('ace/theme/twilight')
        this.editor.session.setMode('ace/mode/javascript')

        this.editor.setValue(`
/*---------------------
';'を入力 or Shift+Enter キーで
プログラムを翻訳開始
---------------------*/
let i = 0;
const j = 0;

i = 3 + (3 * 5);
i += i;

i = i * j;

getMyNumber();

function getMyNumber(){
    const k = 3;
}
        `)
    }

  getCodesArray () {
    return this.editor.getValue().split('\n')
    }
}
export default GrammerView
