import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
}

export const theme = extendTheme(
    { config }, {
    colors: {
        brand: {
            100: "#ECBD00",
            200: "#3182CE",
        },
    },
    styles: {
        global: () => ({
            body: {
                bg: "yellow.700",
                color: 'white',
            },
        }),
    },
})