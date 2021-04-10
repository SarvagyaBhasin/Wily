import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyA9B-7luNCj1JzzZauKhNMBbo9Sph2nAeg",
    authDomain: "wily-1455d.firebaseapp.com",
    projectId: "wily-1455d",
    databaseURL:"https://wily-1455d.firebaseio.com",
    storageBucket: "wily-1455d.appspot.com",
    messagingSenderId: "805163641235",
    appId: "1:805163641235:web:ddc3da22b9c693c2e4a066"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()