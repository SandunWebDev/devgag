import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useColorMode, IconButton } from '@chakra-ui/react';
import React from 'react';

export default function DarkModeToggler() {
    const { colorMode, toggleColorMode } = useColorMode();

    const selectedModeIcon = colorMode === 'light' ? <SunIcon /> : <MoonIcon />;
    const selectedModeTooltip =
        colorMode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';

    return (
        <IconButton
            icon={selectedModeIcon}
            onClick={toggleColorMode}
            title={selectedModeTooltip}
        />
    );
}
