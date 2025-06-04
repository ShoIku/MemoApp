import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = (): void => {
    router.push('/memo/create')
}

const List = (): JSX.Element => {
    const [memos, setMemos] = useState<Memo[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const navigation = useNavigation()

    // すべてのタグを抽出（重複なし）
    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        memos.forEach(memo => {
            (memo.tags || []).forEach(tag => tagSet.add(tag))
        })
        return Array.from(tagSet)
    }, [memos])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<LogOutButton />)
        })
    }, [])

    useEffect(() => {
        if (auth.currentUser === null) { return }
        const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
        const q = query(ref, orderBy('updatedAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const remoteMemos: Memo[] = []
            snapshot.forEach((doc) => {
                const { bodyText, updatedAt, tags = [] } = doc.data()
                remoteMemos.push({
                    id: doc.id,
                    bodyText,
                    updatedAt,
                    tags
                })
            })
            setMemos(remoteMemos)
        })
        return unsubscribe
    }, [])

    // フィルターされたメモ一覧
    const filteredMemos = useMemo(() => {
        if (selectedTags.length === 0) return memos
        return memos.filter(memo =>
            selectedTags.every(tag => memo.tags?.includes(tag))
        )
    }, [memos, selectedTags])

    // タグ選択時のトグル処理
    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    return (
        <View style={styles.container}>
            {/* タグフィルターUI */}
            <View style={styles.tagFilterContainer}>
                <FlatList
                    horizontal
                    data={allTags}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => toggleTag(item)}
                            style={[
                                styles.tagFilterButton,
                                selectedTags.includes(item) && styles.tagFilterButtonSelected
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tagFilterButtonText,
                                    selectedTags.includes(item) && styles.tagFilterButtonTextSelected
                                ]}
                            >
                                #{item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredMemos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MemoListItem memo={item} />}
            />

            <CircleButton onPress={handlePress}>
                <Icon name='plus' size={40} color='#ffffff' />
            </CircleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    tagFilterContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8'
    },
    tagFilterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#e0e0e0',
        marginRight: 8
    },
    tagFilterButtonSelected: {
        backgroundColor: '#467FD3'
    },
    tagFilterButtonText: {
        fontSize: 14,
        color: '#555'
    },
    tagFilterButtonTextSelected: {
        color: '#fff'
    }
})

export default List
