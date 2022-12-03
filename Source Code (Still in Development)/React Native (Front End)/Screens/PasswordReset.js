import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {TextInput, Button} from 'react-native-paper'
function PasswordReset(props) {
    const[title, setTitle] = useState("")
    const[description, setDescription] = useState("")

    const InsertData = () => {
        fetch('http://10.21.183.52/api/articles/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title:title, description:description})})
            .then(res => res.json())
            .then(data => {
                props.navigation.navigate("Home")
            })
            .catch(err => console.log("Error", err))
        }
    return (
        <View>
            <TextInput style = {styles.inputStyle}
                label = "Title"
                value = {title}
                mode = "outlined"

                onChangeText={text => setTitle(text)}
            />
            <TextInput style = {{margin: 10}}
                label = "Description"
                value = {description}
                mode = "outlined"
                multiline
                numberOfLines={10}
                onChangeText={text => setDescription(text)}
            />
            <Button
                style = {{margin: 10}}
                icon = "pencil"
                mode = "contained"
                onPress = {() => InsertData()}
            >Insert Article</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        padding: 10,
        margin: 10
    }
})
export default PasswordReset