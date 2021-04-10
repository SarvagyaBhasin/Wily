import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import LoginScreen from './Screens/loginScreen';
import Search from './Screens/search';
import Transaction from './Screens/transaction';
export default class App extends React.Component {
  render(){
    return (
     <AppContainer/> 
    );
  }
}
const tabnavigator=createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
},{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      const routeName=navigation.state.routeName;
      if(routeName=="Transaction"){
        return(
          <Image source={require("./assets/book.png")}style={{width:40, height:40}}/>
        )
      }
      else if(routeName=="Search"){
        return(
          <Image source={require("./assets/searchingbook.png")}style={{width:40, height:40}}/>
        )
      }
    }
  })
})
const SwitchNavigator=createSwitchNavigator({
  login:{screen:LoginScreen},
  Tabnavigator:{screen:tabnavigator}
})
const AppContainer =createAppContainer(SwitchNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
