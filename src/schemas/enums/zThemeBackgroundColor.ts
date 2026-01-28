import z from 'zod/v4';

export const zThemeBackgroundColor = z.enum([
    'orange',
    'amber',
    'green',
    'lime',
    'blue',
    'sky',
    'cyan',
    'fuchsia',
    'pink',
    'purple',
    'slate',
    'gray',
    'black'
]);
