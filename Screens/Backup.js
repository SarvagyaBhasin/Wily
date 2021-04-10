import React from 'react'
import{Text, View, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ToastAndroid, Alert} from 'react-native'
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from 'firebase'
import db from '../Config';

export default class Transaction extends React.Component{
  constructor(){
    super();
    this.state={
      hascameraPermissions:null,
      scanned:false,
      scannedBookID:'',
      scannedStudentID:'',
      transactionMessage:'',
      buttonState:'normal'
    }
  }
  getCameraPermissions=async(ID)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hascameraPermissions: status=="granted",
      buttonState:ID,
      scanned:false
    })
  }
  handleBarcodescanned=async({type, data})=>{
    const {buttonState}=this.state;
    console.log(buttonState)
    if(buttonState=="BookID"){
      this.setState({scanned:true,scannedBookID:data,buttonState:'normal'})
    }else if(buttonState=="StudentID"){
      this.setState({scanned:true,scannedStudentID:data,buttonState:'normal'})
    }
    console.log(this.state.scannedStudentID)
  }
  initiatebookissue=async()=>{
    db.collection("Transactions").add({
      'studentID':this.state.scannedStudentID,
      'bookID':this.state.scannedBookID,
      'date':firebase.firestore.Timestamp.now().toDate(),
      'Transactiontype':"Issue"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({'BookAvailablity':false})
    db.collection("Students").doc(this.state.scannedStudentID).update({'Numberofbooksissued':firebase.firestore.FieldValue.increment(1)});
    this.setState({scannedStudentID:'', scannedBookID:''})
  }
  initiatebookreturn=async()=>{
    db.collection("Transactions").add({
      'studentID':this.state.scannedStudentID,
      'bookID':this.state.scannedBookID,
      'date':firebase.firestore.Timestamp.now().toDate(),
      'Transactiontype':"Return"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({'BookAvailablity':true})
    db.collection("Students").doc(this.scannedStudentID).update({'Numberofbooksissued':firebase.firestore.FieldValue.decrement(-1)});
    this.setState({scannedStudentID:'', scannedBookID:''})
  }
  checkbookeligibility=async()=>{
    const bookref = await db.collection("Books").where("BookID","==",this.state.scannedBookID).get();
    var Transactiontype="";
    if(bookref.docs.length==0){
      Transactiontype=false;

    }else{
      bookref.docs.map((doc)=>{
        var book=doc.data();
        var bA=book.BookAvailablity;
        console.log("bAx "+bA);
        if(bA){
          Transactiontype="Issued"
        }else{
          Transactiontype="Return"
        }
      })
    }
    console.log(Transactiontype)
    return Transactiontype()
  }
  checkstudenteligibilityforbookissue=async()=>{
    const studentref = await db.collection("Students").where("studentID","==",this.state.scannedStudentID).get();
    var iseligible="";
    if(studentref.docs.length==0){
      this.setState({scannedStudentID:'', scannedBookID:''})
      iseligible=false;
      Alert.alert("Student does not exit in the database")
    }else{
      studentref.docs.map((doc)=>{
        var student=doc.data();
        if(student.Numberofbooksissued<2){
          iseligible=true;
        }else{
          iseligible=false;
          Alert.alert("The student has taken two books already");
          this.setState({scannedStudentID:'', scannedBookID:''})
        }
      })
    }
    console.log("Issue "+iseligible)
    return iseligible;
  }
  checkstudenteligibilityforbookreturn=async()=>{
    const studentref = await db.collection("Transactions").where("bookID","==",this.state.scannedBookID).limit(1).get();
    var iseligible="";
    
      studentref.docs.map((doc)=>{
        var lastTransaction=doc.data();
        console.log(lastTransaction);
        if(lastTransaction.studentID==this.state.scannedStudentID){
          iseligible=true;
        }else{
          iseligible=false;
          Alert.alert("The book wasn't issued to this student");
          this.setState({scannedStudentID:'', scannedBookID:''})
        }
      })
      console.log("Return "+iseligible)
    return iseligible;
  }
  handletransaction=async()=>{
    var Transactiontype=await this.checkbookeligibility();
    if(!Transactiontype){Alert.alert("This book is not there in the library")}
    else if(Transactiontype=="Issued"){
      var isStudenteligible=await this.checkstudenteligibilityforbookissue();
      if(isStudenteligible){
        this.initiatebookissue();
        Alert.alert("Book Issued")
      }
    }else{
      var isStudenteligible=await this.checkstudenteligibilityforbookreturn();
      if(isStudenteligible){
        this.initiatebookreturn();
        Alert.alert("Book Returned")
      }
    }
  }
  render(){
    const hascameraPermissions=this.state.hascameraPermissions;
    const scanned=this.state.scanned;
    const buttonState=this.state.buttonState;
    if(buttonState!="normal" && hascameraPermissions){
      console.log(buttonState)
      return(
        <BarCodeScanner
        onBarCodeScanned={scanned?undefined:(()=>{this.handleBarcodescanned})} 
        style={StyleSheet.absoluteFillObject}
        />
      )
    }
    else if(buttonState=="normal"){
      console.log(buttonState)
      return(
        <KeyboardAvoidingView style={styles.container}behavior="padding" enabled>
          <View>
            <Image source={require("../assets/booklogo.jpg")}style={{width:200, height:200, alignSelf:'center'}}/>
            <Text style={{textAlign:'center', fontSize:35}}>WILY</Text>
        </View>     
        <View style={styles.inputview}>
          <TextInput style={styles.inputBox} placeholder="Book ID" value={this.state.scannedBookID}onChangeText={(text)=>{this.setState({scannedBookID:text})}}>
          </TextInput>
          <TouchableOpacity style={styles.scannedbutton} onPress={()=>{this.getCameraPermissions("BookID")}}>
          <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputview}>
          <TextInput style={styles.inputBox} placeholder="Student ID" value={this.state.scannedStudentID}onChangeText={(text)=>{this.setState({scannedStudentID:text})}}>
          </TextInput>
          <TouchableOpacity style={styles.scannedbutton} onPress={()=>{this.getCameraPermissions("StudentID")}}>
          <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <Text>
          {this.state.transactionMessage}
        </Text>
        <TouchableOpacity style={styles.submitButton}
        onPress={async()=>{await this.handletransaction()}}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      )
    }
  }
}
const styles = StyleSheet.create({
  cintainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  scannedbutton:{
    backgroundColor:'#2143ff',
    width:50,
    borderWidth:1.5,
    borderLeftWidth:0
  },
  inputBox:{
  width:200,
  height:40,
  borderWidth:1.5,
  borderRightWidth:0,
  fontSize:20
  },
  buttonText:{
    fontSize:20,
  },
  inputview:{
    flexDirection:'row',
    margin:20,
  },
  submitButton:{
    backgroundColor:'#FBC02D',
    width:100,
    height:50,
    alignSelf:'center'
  },
  submitButtonText:{
    padding:10,
    textAlign:"center",
    fontSize:20,
    fontWeight:'bold',
    color:'white'
  }
})