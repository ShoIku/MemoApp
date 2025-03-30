import { View, Text, StyleSheet } from 'react-native'

const Index = (): JSX.Element => {
    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Text>Memo App</Text>
                    <Text>ログアウト</Text>
                </View>
            </View>

            <View> {/* memo list */}
                <View> {/* memo list item */}
                    <View> {/* 左 */}
                        <Text>買い物リスト</Text>
                        <Text>2023年10月1日 10:00</Text>
                    </View>
                    <View> {/* 右 */}
                        <Text>X</Text>
                    </View>
                </View>
            </View>

            <View> {/* memo list */}
                <View> {/* memo list item */}
                    <View> {/* 左 */}
                        <Text>買い物リスト</Text>
                        <Text>2023年10月1日 10:00</Text>
                    </View>
                    <View> {/* 右 */}
                        <Text>X</Text>
                    </View>
                </View>
            </View>

            <View> {/* memo list */}
                <View> {/* memo list item */}
                    <View> {/* 左 */}
                        <Text>買い物リスト</Text>
                        <Text>2023年10月1日 10:00</Text>
                    </View>
                    <View> {/* 右 */}
                        <Text>X</Text>
                    </View>
                </View>
            </View>

            <View>
                <Text>+</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Index
