var firebaseConfig = {
  apiKey: "AIzaSyD4r0jad7ygncgsC-8dmGltDwQwkt9gUwg",
  authDomain: "placetest-f71e3.firebaseapp.com",
  databaseURL: "https://placetest-f71e3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "placetest-f71e3",
  storageBucket: "placetest-f71e3.appspot.com",
  messagingSenderId: "768069945327",
  appId: "1:768069945327:web:995227b8029f96b26ed81a",
  measurementId: "G-L4TETJTKT7"
};
firebase.initializeApp(firebaseConfig);

let user
function signIn() {
  var provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  user = result.user;
  // ...
  }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  });
}

var db = connectFirebase();
firebase.analytics();

function connectFirebase() {
  console.log("connecting...")
  // Get a reference to the database service
  var db = firebase.database();
  return db;
}

function writeTile(x,y,color) {
  db.ref('/tiles/' + 'tile_'+x+'_'+y).set({
    x: x,
    y: y,
    color : color,
    user: user.displayName
  });
}

function initDB() {
  return db.ref('/tiles/').once('value').then(function(snapshot) {
    tiles = snapshot.val()
    // console.log(snapshot.val())
    for (index in tiles) {
      tile = tiles[index]
      addTile(tile.x,tile.y, tile.color)
    }
  }).then(_ => {
    console.log('finished loading')
    document.getElementById("loader").style.display = 'none'
    document.getElementById("loaded").style.display= 'inline'
    draw()

    db.ref().child('/tiles/').on('child_changed', function(data) {
      console.log('child_changed ', data.val())
      let tile = data.val()
      addTile(tile.x, tile.y, tile.color)
      draw()
    });
  });
}

initDB()