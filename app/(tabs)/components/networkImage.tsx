import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface NetworkImageProps {
  uri: string;
  loadingUri: any;
  style: StyleProp<ImageStyle>;
}

const isProbablyValidUri = (uri: string): boolean => {
  if (!uri) return false;
  return (
    uri.startsWith('http') ||
    uri.startsWith('file://') ||
    uri.startsWith('data:image')
  );
};

const NetworkImage: React.FC<NetworkImageProps> = ({ uri, loadingUri, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasFailed(false);
  }, [uri]);

  const isValidUri = isProbablyValidUri(uri);
  const shouldShowPlaceholder = !isValidUri || !isLoaded || hasFailed;

  return (
    <Image
      source={shouldShowPlaceholder ? loadingUri : { uri }}
      style={style}
      resizeMode="cover"
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setIsLoaded(false);
        setHasFailed(true);
      }}
    />
  );
};

export default NetworkImage;
