import { View, Text, ScrollView, StyleSheet } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { onSnapshot, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

import CircleButton from "../../components/CircleButton"
import Icon from "../../components/Icon"
import { auth, db } from "../../config"
import { type Memo } from "../../../types/memo"

const Detail = (): JSX.Element => {
  const { id } = useLocalSearchParams()
  const memoId = String(id)
  const [memo, setMemo] = useState<Memo | null>(null)

  useEffect(() => {
    if (auth.currentUser === null) return

    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, memoId)
    const unsubscribe = onSnapshot(ref, (memoDoc) => {
      const data = memoDoc.data()
      if (!data) return

      const bodyText = data.bodyText ?? ""
      const updatedAt = data.updatedAt ?? null
      const tags = Array.isArray(data.tags) ? data.tags : []

      setMemo({
        id: memoDoc.id,
        bodyText,
        updatedAt,
        tags
      })
    })

    return unsubscribe
  }, [memoId])

  const handlePress = (): void => {
    router.push({ pathname: "/memo/edit", params: { id: memoId } })
  }

  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoTitle} numberOfLines={1}>
          {memo?.bodyText ?? ""}
        </Text>
        <Text style={styles.memoDate}>
          {memo?.updatedAt ? memo.updatedAt.toDate().toLocaleString("ja-JP") : ""}
        </Text>
      </View>

      <ScrollView style={styles.memoBody}>
        <Text style={styles.memoBodyText}>{memo?.bodyText ?? ""}</Text>

        {/* タグ表示部分 */}
        <View style={styles.tagsContainer}>
          {(memo?.tags ?? []).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <CircleButton onPress={handlePress} style={{ top: 60, bottom: "auto" }}>
        <Icon name="pencil" size={40} color="#ffffff" />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  memoHeader: {
    backgroundColor: "#467FD3",
    height: 96,
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 19
  },
  memoTitle: {
    color: "#ffffff",
    fontSize: 20,
    lineHeight: 32,
    fontWeight: "bold"
  },
  memoDate: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 16
  },
  memoBody: {
    paddingHorizontal: 27
  },
  memoBodyText: {
    paddingVertical: 32,
    fontSize: 16,
    lineHeight: 24,
    color: "#000000"
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    paddingHorizontal: 4
  },
  tag: {
    backgroundColor: "#467FD3",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    color: "#ffffff",
    fontSize: 14
  }
})

export default Detail
