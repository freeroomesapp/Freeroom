# Freeroom
Ejecutar la aplicacion desde un servidor local

1. Instalar Node.js
2. Instalar Metro

Luego, para depurar la aplicacion a nivel local
1. Iniciar Metro

npx react-native start

2. Iniciar la applicacion
Abrir una nueva terminal y ejecutar el comando para correr el emulador

npx react-native run-android

Despues, se podria ejecutar con EAS, proyecto: freeroom
1. npm install --global eas-cli && npx create-expo-app freeroom && cd freeroom && eas init --id 75742d40-2597-480a-88a6-4d497f67b741
o
npm install --global eas-cli && eas init --id 75742d40-2597-480a-88a6-4d497f67b741

2. npx expo start

Especificamente, podremos crear un APK de Android con React Native Expo
1. npm install -g eas-cli
2. npm install -g npm@10.8.2
3. eas whoami
4. eas build:configure 
o usar (npx cross-env EAS_NO_VCS=1 eas build:configure) to use EAS CLI without Git
5. ver eas.json y
6. eas build -p android --profile preview
o usar (npx cross-env EAS_NO_VCS=1 eas build -p android --profile preview) to use EAS CLI without Git

