import { Button } from "../components/button/Button";
import { View } from "react-native";

function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Button variant="default" size="lg" onPress={() => alert('Default pressed!')}>
        Default Button
      </Button>

      <Button variant="outline" onPress={() => alert('Outline pressed!')}>
        Outline Button
      </Button>
      
      <Button variant="destructive" size="sm" onPress={() => alert('Destructive pressed!')}>
        Destructive
      </Button>
    </View>
  );
}

export default Index;