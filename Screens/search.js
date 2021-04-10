import React from 'react'
import{Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native'
import db from '../Config';
import {ScrollView} from 'react-native-gesture-handler'
export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state={
      allTransactions:[],
      lastvisibleTransaction:null,
      search:''
    }
  }
  searchTransaction=async(text)=>{
    var enterText=text.split("");
    if(enterText[0].toUpperCase()=='B'){
      const transaction=await db.collection("Transactions").where('bookID','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
    else if(enterText[0].toUpperCase()=='S'){
      const transaction=await db.collection("Transactions").where('studentID','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
  }
  fetchmoreTransaction=async()=>{
    var text=this.state.search.toUpperCase()
    var enterText=text.split("");
    if(enterText[0].toUpperCase()=='B'){
      const transaction=await db.collection("Transactions").where('bookID','==',text).startAfter(this.state.lastvisibleTransaction).limit(10).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
    else if(enterText[0].toUpperCase()=='S'){
      const transaction=await db.collection("Transactions").where('studentID','==',text).startAfter(this.state.lastvisibleTransaction).limit(10).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
  }
  componentDidMount=async()=>{
    const query=await db.collection("Transactions").limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions:[],
        lastvisibleTransaction:doc
      })
    })
  }
  render(){
    return(
      <View style={styles.container}>
      <View style={styles.searchbar}>
      <TextInput style={styles.bar}
      placeholder="enter book ID or student ID"
      onChangeText={(text)=>{this.setState({search:text})}}>
      </TextInput>
      <TouchableOpacity style={styles.searchButton} onPress={()=>{this.searchTransaction(this.state.search)}}>
      <Text>Search</Text>
      </TouchableOpacity>
      </View>
      <FlatList
      data={this.state.allTransactions}
      renderItem={({item})=>(
        <View style={{borderBottomWidth:1}}>
          <Text>{"bookID :"+item.bookID}</Text>
          <Text>{"studentID :"+item.studentID}</Text>
          <Text>{"TransactionType :"+item.Transactiontype}</Text>
          <Text>{"Date :"+item.date.toDate}</Text>
        </View>
      )}
      keyExtractor={(item,index)=>index.toString()}
      onEndReached={this.fetchmoreTransaction}
      onEndReachedThreshold={0.7}
      />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:20
  },
  searchbar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'grey'
  },
  bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'purple'
  }
})