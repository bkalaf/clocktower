import { zThemeBackgroundColor } from './enums/zThemeBackgroundColor';
import { zThemeDensity } from './enums/zThemeDensity';
import z from 'zod/v4';

export const zUserSettings = z.object({
    backgroundColor: zThemeBackgroundColor.default('slate'),
    density: zThemeDensity.default('comfy')
});

export type UserSettings = z.infer<typeof zUserSettings>;
