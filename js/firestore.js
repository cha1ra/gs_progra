// Initialize Firebase
var config = {
    apiKey: "AIzaSyDsp_XBjITWuCGhLZbtIB7vDJFDJ3LbTn8",
    authDomain: "progra-630c2.firebaseapp.com",
    databaseURL: "https://progra-630c2.firebaseio.com",
    projectId: "progra-630c2",
    storageBucket: "progra-630c2.appspot.com",
    messagingSenderId: "459873390563"
};
firebase.initializeApp(config);


/*-------------------------
Login UI
-------------------------*/

// FirebaseUI config.
var uiConfig = {
signInSuccessUrl: './',
signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    //firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
],
// tosUrl and privacyPolicyUrl accept either url string or a callback
// function.
// Terms of service url/callback.
tosUrl: '<your-tos-url>',
// Privacy policy url/callback.
privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
}
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


/*-------------------------
Firebase Store
-------------------------*/
const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
const codesRef = db.collection('Codes');


let myInfo = {};
isLoginUser();
//FIXME: この部分を直したい
setTimeout(()=>{
    realTimeUpdater()
},1500);


function postBook(postsRef){
    postsRef.add({
        comment:$('#post-comment').val(),
        date:Date.now(),
        group:'me',
        url:$('#post-url').val(),
        user:myInfo.name
    })
    .then(function(docRef) {
        console.log("以下のIDで書き出されました: ", docRef.id);
        resetForm();
        realTimeUpdater(currentTL);
    })
    .catch(function(error) {
        console.error("投稿追加時のエラー: ", error);
    });
}

/*-------------------------------
Login Authentication
-------------------------------*/
function isLoginUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            getMyInfo(user);
            return true;
        } else {
            // No user is signed in.
            //location.href = './login.html';
            console.log('no Login');
            return false;
        }
      });
    
    function getMyInfo(user){
        myInfo.name = user.displayName;
        myInfo.email = user.email;
        myInfo.uid = user.uid;
        console.log(myInfo);
    }
}

/*-------------------------------
Post related function
-------------------------------*/


function postCode(codesRef,myCode){
    codesRef.add({
        title:$('#progra-title').val(),
        date:Date.now(),
        code:myCode,
        user:myInfo.uid
    })
    .then(function(docRef) {
        console.log("以下のIDで書き出されました: ", docRef.id);
        //realTimeUpdater(currentTL);
    })
    .catch(function(error) {
        console.error("投稿追加時のエラー: ", error);
    });
}

/*-------------------------------
Realtime Update
-------------------------------*/
function realTimeUpdater(){
    update();    
    return false;

    function update(){
        console.log(myInfo.uid);
        var val;
        val = codesRef.where("user", "==", myInfo.uid).orderBy('date', 'asc');
        val.onSnapshot(function(querySnapshot) {
            $('#my-codes').empty();
            querySnapshot.forEach(function(doc) {
                $('#my-codes').append(createCodeHtml(doc));
            });
        });

    }
}

function createCodeHtml(doc){
    let docData = doc.data();
    let returnHtml = '<div class="card">' + 
        '<div class="card-title">' +
            docData.title + 
        '</div>' + 
        '<div class="card-date">' + 
            formatDate (docData.date) + 
        '</div>' +
        '<div class="card-desc">' + 
            docData.code + 
        '</div>' +
        '</div>';
    return returnHtml;
}

function formatDate(val){
    let d = new Date(val);
    let result = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${addZero(d.getHours())}:${addZero(d.getMinutes())}`
    return result;

    function addZero(val){
        if(val<10)return '0' + val;
        else return val;
    }
}