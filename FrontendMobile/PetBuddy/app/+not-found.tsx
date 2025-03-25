import * as React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useState } from "react";

const NotFound: React.FC = () => {
  const [image1Loading, setImage1Loading] = useState(true);
  const [image2Loading, setImage2Loading] = useState(true);
  const [image1Error, setImage1Error] = useState(false);
  const [image2Error, setImage2Error] = useState(false);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="main"
      accessibilityLabel="404 Not Found Page"
    >
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/8652f5a2af614b3fa8fcac9320912096/09b2b107d49d6b787c9d28fecd06095017158891be04e1e53f433392549f084a?placeholderIfAbsent=true",
        }}
        style={styles.image}
        accessibilityLabel="404 Error Illustration"
        onLoadStart={() => setImage1Loading(true)}
        onLoadEnd={() => setImage1Loading(false)}
        onError={() => setImage1Error(true)}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title} accessibilityRole="header">
          404 Not Found!
        </Text>
      </View>

      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/8652f5a2af614b3fa8fcac9320912096/90f3ff64b85a379cc306825c8f6445d69721c451199373f7a9e8fa636399ff5d?placeholderIfAbsent=true",
        }}
        style={styles.image}
        accessibilityLabel="Additional 404 Illustration"
        onLoadStart={() => setImage2Loading(true)}
        onLoadEnd={() => setImage2Loading(false)}
        onError={() => setImage2Error(true)}
      />

      {(image1Loading || image2Loading) && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {(image1Error || image2Error) && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load some images</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginVertical: 16,
  },
  textContainer: {
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
});

export default NotFound;
