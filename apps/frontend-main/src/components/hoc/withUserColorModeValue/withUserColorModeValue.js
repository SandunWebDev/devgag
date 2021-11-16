import { useColorMode } from '@chakra-ui/react';
import React from 'react';

// Helper HOC to use "useColorMode" hook in class components.
export default function withUserColorModeValue(WrappedComponent) {
    return (props) => {
        const { colorMode } = useColorMode();

        return <WrappedComponent colorMode={colorMode} {...props} />;
    };
}
