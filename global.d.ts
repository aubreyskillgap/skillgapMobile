// declarations.d.ts
declare module 'react-native-heroicons/outline';
declare module 'react-native-heroicons/solid';
declare module 'react-native-responsive-screen';
declare module '@react-native-async-storage/async-storage';

declare module '*.svg' {
  import React from 'react'
    import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}