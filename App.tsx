import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import Hello from './src/components/Hello'


const App = (): JSX.Element => {

  return (
    <View style={styles.container}>
      <Hello bang>World</Hello>
      <Hello style={{fontSize: 16}}>World</Hello>
      <Text>memoapp!!!!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App
