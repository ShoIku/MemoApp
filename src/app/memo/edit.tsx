import { 
  View, TextInput, StyleSheet, Alert, ScrollView, Text, TouchableOpacity 
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { auth, db } from '../../config'
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'

const handlePress = (id: string, bodyText: string, tags: string[]): void => {
  if(auth.currentUser === null) { return }
  const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
  setDoc(ref, {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date()),
    tags
  })
    .then(() => {
      router.back()
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('更新に失敗しました')
    })
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [bodyText, setBodyText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if(auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef?.data()
        setBodyText(data?.bodyText ?? '')
        setTags(Array.isArray(data?.tags) ? data.tags : [])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if(trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const onPressSave = () => {
    handlePress(id, bodyText, tags)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.inputContainer} keyboardShouldPersistTaps="handled">

        <TextInput
          multiline
          style={styles.input}
          value={bodyText}
          onChangeText={setBodyText}
          autoFocus
          placeholder="メモ内容"
        />

        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="タグを入力"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={addTag} // エンターキーで追加も可能
          />
          <TouchableOpacity onPress={addTag} style={styles.addButton}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagList}>
          {tags.map(tag => (
            <View key={tag} style={styles.tagItem}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)} style={styles.removeButton}>
                <Icon name='delete' size={12} color='black' />
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      <CircleButton onPress={onPressSave}>
        <Icon name='check' size={40} color='ffffff' />
      </CircleButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    paddingHorizontal: 27,
    paddingVertical: 16,
    paddingBottom: 70,
    flexGrow: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff'
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },
  tagInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    borderColor: '#467FD3',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff'
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: '#467FD3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tagItem: {
    flexDirection: 'row',
    backgroundColor: '#467FD3',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center'
  },
  tagText: {
    color: 'white',
    marginRight: 8
  },
  removeButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingVertical: 2
  },
  removeButtonText: {
    color: '#467FD3',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 14
  }
})

export default Edit
