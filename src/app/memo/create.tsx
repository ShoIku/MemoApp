import {
    View, TextInput,  StyleSheet
} from 'react-native'

import {router} from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from  '../../components/Icon'
import { auth, db } from '../../config'

const handlePress = (bodyText: string): void => {
    if (auth.currentUser === null){ return }
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)

    addDoc(ref, {
        bodyText, //: bodyText
        updatedAt: Timestamp.fromDate(new Date())
    })
    .then( (docRef) => {
        console.log('success', docRef.id)
        router.back()
    })
    .catch( (error) => {
        console.log(error)
    })

    // await addDoc(collection(db, 'memos'), {
    //     bodyText: 'test2'
    // })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // router.back()
}

const Create = ():JSX.Element => {
    const [bodyText, setBodyText] = useState('')

    return (
        <KeyboardAvoidingView  style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                    multiline 
                    style={styles.input} 
                    value={bodyText}
                    onChangeText={(text) => { setBodyText(text) }}
                    autoFocus
                />
            </View>

            <CircleButton onPress={() => {handlePress(bodyText)}}>
                <Icon name='check' size={40} color='ffffff'/>
            </CircleButton>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24
    }
})

export default Create
