import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { deleteDoc, doc } from 'firebase/firestore'

import Icon from './Icon'
import { Link } from 'expo-router'
import { type Memo } from '../../types/memo'
import { auth, db } from '../config'

interface Props {
    memo: Memo
}

const handlePress = (id: string): void => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    Alert.alert('メモを削除します', 'よろしいですか', [
        { text: 'キャンセル' },
        {
            text: '削除する',
            style: 'destructive',
            onPress: () => {
                deleteDoc(ref).catch(() => {
                    Alert.alert('削除に失敗しました')
                })
            }
        }
    ])
}

const MemoListItem = (props: Props): JSX.Element | null => {
    const { memo } = props
    const { bodyText, updatedAt, tags = [] } = memo
    if (bodyText === null || updatedAt === null) { return null }
    const dateString = updatedAt.toDate().toLocaleString('ja-JP')
    return (
        <Link
            href={{ pathname: '/memo/detail', params: { id: memo.id } }}
            asChild
        >
            <TouchableOpacity>
                <View style={styles.memoListItem}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={styles.memoListItemTitle}>{bodyText}</Text>
                        <Text style={styles.memoListItemDate}>{dateString}</Text>

                        {/* タグ表示 */}
                        <View style={styles.tagContainer}>
                            {tags.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { handlePress(memo.id) }}>
                        <Icon name='delete' size={32} color='#b0b0b0' />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    memoListItem: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 19,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)'
    },
    memoListItemTitle: {
        fontSize: 16,
        lineHeight: 32
    },
    memoListItemDate: {
        fontSize: 12,
        lineHeight: 16,
        color: '#848484'
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6
    },
    tag: {
        backgroundColor: '#467FD3',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginTop: 6
    },
    tagText: {
        color: '#fff',
        fontSize: 12
    }
})

export default MemoListItem
