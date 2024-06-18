import { EDSStyleSheet, Typography, useStyles } from "@equinor/mad-components";
import { View } from "react-native";

export const HelloWorld = () => {
    const styles = useStyles(themeStyles);
    return <View style={styles.container}>
        <Typography>Hello world!</Typography>
    </View>
}

const themeStyles = EDSStyleSheet.create((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.container.background,
        alignItems: 'center',
        justifyContent: "center"
    }
}))