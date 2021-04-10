import React from 'react'
import{Text, View, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ToastAndroid, Alert} from 'react-native'
import * as firebase from 'firebase';
export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state={email:'',password:''}
    }
    login=async(email,password)=>{
        if(email&&password){
            try{
                const response=await firebase.auth().signInWithEmailAndPassword(email,password);
                if(response){
                    this.props.navigation.navigate("Transaction")
                }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found':
                        Alert.alert("user does not exist in the database");
                        break;
                    case 'auth/invalid-email':
                        Alert.alert("incorrect email")
                        break;
                }
            }
        }
        else{
            Alert.alert("Please enter e-mail ID and password")
        }
    }
    render(){
        return(
            <KeyboardAvoidingView style={{alignItems:'center', marginTop:20}}>
                <View>
                    <Image style={{width:200, height:200}}source={require("../assets/booklogo.jpg")}/>
                </View>
                <View>
                    <TextInput style={styles.InputBox}
                    placeholder="abc@email.com" keyboardType="email-address" onChangeText={(text)=>{this.setState({email:text})}}>
                    </TextInput>
                    <TextInput style={styles.InputBox}
                    placeholder="password" secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}}>
                    </TextInput>
                </View>
                <View>
                    <TouchableOpacity style={styles.button}
                    onPress={()=>{this.login(this.state.email, this.state.password)}}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles=StyleSheet.create({
    InputBox:{
            width:300,
            height:40,
            borderWidth:1.5,
            fontSize:20,
            margin:10,
            paddingLeft:10
            },
    button:{
        height:30,
        width:90,
        borderWidth:1,
        marginTop:20,
        paddingTop:5,
        borderRadius:7
    }
})