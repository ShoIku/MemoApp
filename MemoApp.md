# Udemy - MemoApp

## Expo
- `nvs use lts`でnode.jsを有効にする
- `npx create-expo-app --tamplate`でExpoの新規作成
  - Blank (TypeScript)を選択
  - App名を入力
- `npx expo start`でExpo立ち上げ
- 機種の選択
- `npx expo install`で現在のバージョンに合わせてインストール
- `npm install`で最新のバージョンをインストール

### ポートが使用されている場合
- `netstat -ano | findstr :8081`でPIDを検索
- `taskkill /PID <PID> /F` でPID強制終了

## ESLintのインストール
- `nvs use lts`
- `npm install eslint --save-dev`でインストール
- `npx eslint --init`で初期化
  
## TypeScript
### テンプレート
```typescript
import { View, Text, StyleSheet} from 'react-native'

import Header from '../../component/header'

const Index = ():JSX.Element => {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Index

```

### FlexBox
- `justifyContent` : 縦方向の位置を決める`center`など
- `alignItems`: 横方向の位置を決める`center`など
- `alignSelf`: flexbox自身の並べ方を決める`flex-start`
- `flexDirection`: flexBoxを横並びにするときに`row`

### ボタン関係
##### ボタンを押す動作
- `TouchableOpacity`を`react-native`からimportし、該当する`View`を`TouchableOpacity`に変更する
##### 押すとリンクに飛ぶ
- `import {Link} from 'expo-router'`
- 該当箇所を`<Link href='/hoge/hogehoge' asChild>`で囲む
  - 後ろにreplaceをつけると遷移履歴を残さない
- ボタンでは`onPress`を使用
- componentではPropsに`onPress`を追加し、TouchableOpacityに`onPress={onPress}`を追加
- 呼び出し時には
  - `onPress={handlePress}`
  - `import {router} from 'expo-router'`
  - `const handlePress = () => { router.push }`

### スタックナビゲーション (_layout.tsx)
画面遷移の履歴を保存してくれる

_layout.tsxで
```typescript
import { Stack } from 'expo-router'

const Layout = ():JSX.Element => {
    return <Stack />
}

export default Layout
```

##### ヘッダーの編集例 (_layout.tsx)
```typescript
import { Stack } from 'expo-router'

const Layout = ():JSX.Element => {
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#467FD3'
        },
        headerTintColor: '#ffffff',
        headerTitle: 'Memo App',
        headerBackTitle: 'Back',
        headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold'
        }
    }} />
}

export default Layout

```


### useState (log_in.tsx)
- `const [email, setEmail] = useState('')`: `email`が値を保持する箱、`setEmail`が値を更新する関数
  
```typescript
<TextInput 
    style={styles.input} 
    value={email} 
    onChangeText={(text) => { setEmail(text) }}
/>
```
このようにすると入力できるようになる

- `autoCapitalize='none'`: 先頭を大文字にしない
- `keyboardType='email-address'`: @をキーボードに表示 
- `secureTextEntry`: パスワードを入力時に見えなくする
- `placeholder='Email Address'`: 最初に書かれているラベルを設定

### firebaseのconfig情報をgit対象外にする方法
- .envファイルを作成し、configの情報を以下のようにコピペ
```
EXPO_PUBLIC_FB_API_KEY=XXX
EXPO_PUBLIC_FB_AUTH_DOMAIN=XXX
EXPO_PUBLIC_FB_PROJECT_ID=XXX
EXPO_PUBLIC_FB_STORAGE_BUCKET=XXX
EXPO_PUBLIC_FB_MESSAGING_SENDER_ID=XXX
EXPO_PUBLIC_FB_APP_ID=XXX
```
- 元のconfigを変数を以下のように使って書き換える
```
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FB_APP_ID
}
```

- .gitignoreに.envを追加
- .git.sampleファイルを作成し、サンプルのみをgitに公開

### 会員登録 (sign_up.tsx)
- firebaseのauthenticationで登録方法を選択
- `handlePress`の引数に`email: string`と`password: string`を追加
- `<Button label='submit' onPress={() => { handlePress(email, password) }}/>`:emailとpasswordを受け取る
- インポートする
```typescript
`import { createUserWithEmailAndPassword } from 'firebase/auth'`
`import { auth } from '../../config'`
```
```typescript
const handlePress = (email: string, password: string): void => {
    //会員登録
    console.log(email, password)
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user.uid)
            router.replace('/memo/list')
        }) //上が成功したときの処理
        .catch((error) => {
            const { code, message } = error 
            console.log(code, message)
            Alert.alert(message)

        })//上が失敗したときの処理
}
```

### ログイン (log_in.tsx)
- 会員登録とほぼ同じ
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config'
```
```typescript
const handlePress = (email: string, password: string): void => {
    //ログイン
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user.uid)
            router.replace('memo/list')
        })
        .catch((error) => {
            const { code, message} = error
            console.log(code, message)
            Alert.alert(message)
        })
}
```

### useEffectでログイン状態を監視 (index.tsx)
```
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
```

```typescript
useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
        if(user !== null) {
            router.replace('/memo/list')
        }
    })
}, [])
```

### ログアウト (LogOutButton)
```typescript
import { signOut } from "firebase/auth"
import { auth } from "../config"
```

```
const handlePress = (): void => {
    signOut(auth)
    .then(() => {
        router.replace('/auth/log_in')
    })
    .catch(() => {
        Alert.alert('ログアウトに失敗しました')
    })
}
```

### firebaseにデータを追加 (create.tsx)
- firestore databaseのFirebase Storeを作成
  - Cloud Firestoreは"collection>document>data"で構成
- メモ作成ボタンでの処理
```typescript
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config'
```
```typescript
const handlePress = (bodyText: string): void => {
    if (auth.currentUser === null){ return }
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)

    addDoc(ref, {
        bodyText, //: bodyText
        updatedAt: Timestamp.fromDate(new Date()) //日時の保存
    })
    .then( (docRef) => {
        console.log('success', docRef.id)
        router.back()
    })
    .catch( (error) => {
        console.log(error)
    })
}
```


### firebaseのデータを読み込む (list.tsx)

```typescript
useEffect(() => {
    if(auth.currentUser === null) {return}
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const remoteMemos: Memo[] = []
        snapshot.forEach((doc) => {
            console.log('memo', doc.data())
            const { bodyText, updatedAt} = doc.data()
            remoteMemos.push({
                id: doc.id,
                bodyText,
                updatedAt
            })
        })
        setMemos(remoteMemos)
    })
    return unsubscribe
}, [])
```
- `useEffect`の戻り値には、アンマウントされた時の処理を書く
- FlatListで表示

