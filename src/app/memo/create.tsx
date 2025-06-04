import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native"

import { router } from "expo-router"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useState } from "react"

import KeyboardAvoidingView from "../../components/KeyboardAvoidingView"
import CircleButton from "../../components/CircleButton"
import Icon from "../../components/Icon"
import { auth, db } from "../../config"

const Create = (): JSX.Element => {
  const [bodyText, setBodyText] = useState("")
  const [tagText, setTagText] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    const trimmed = tagText.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagText("")
  }

  const handlePress = (): void => {
    if (auth.currentUser === null) return

    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
    addDoc(ref, {
      bodyText,
      tags,
      updatedAt: Timestamp.fromDate(new Date())
    })
      .then((docRef) => {
        console.log("success", docRef.id)
        router.back()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          style={styles.input}
          value={bodyText}
          onChangeText={(text) => setBodyText(text)}
          autoFocus
        />

        {/* タグ入力欄 */}
        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            placeholder="タグを入力"
            value={tagText}
            onChangeText={setTagText}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>

        {/* 現在のタグ一覧表示 */}
        <View style={styles.tagList}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <CircleButton onPress={handlePress}>
        <Icon name="check" size={40} color="ffffff" />
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
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  tagInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 8,
    fontSize: 16
  },
  addButton: {
    backgroundColor: "#467FD3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  tagItem: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 14,
    color: "#333"
  }
})

export default Create
