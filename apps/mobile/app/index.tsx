import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, Text } from 'react-native'

const App = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>Page</Text>
      <StatusBar style="dark" translucent />
    </SafeAreaView>
  )
}

export default App
