// Written by "obrassard" on GitHub
// https://github.com/expo/router/discussions/436
import { usePathname } from "expo-router";
import { useEffect } from "react";

export function useTabEffect(route: string, effect: () => void) {
    const path = usePathname();
    useEffect(() => {
        if (path === route) {
            effect();
        }
    }, [path])
}