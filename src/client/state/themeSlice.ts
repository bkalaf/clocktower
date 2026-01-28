import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import z from 'zod/v4';
import { zThemeBackgroundColor } from '@/schemas/enums/zThemeBackgroundColor';
import { zThemeDensity } from '@/schemas/enums/zThemeDensity';

export type ThemeDensity = z.infer<typeof zThemeDensity>;
export type ThemeBackgroundColor = z.infer<typeof zThemeBackgroundColor>;

const densityGapMap: Record<ThemeDensity, string> = {
    spacious: 'gap-3',
    comfy: 'gap-2',
    compact: 'gap-1'
};

const backgroundColorClassMap: Record<ThemeBackgroundColor, string> = {
    orange: 'bg-orange-800',
    amber: 'bg-amber-800',
    green: 'bg-green-800',
    lime: 'bg-lime-800',
    blue: 'bg-blue-800',
    sky: 'bg-sky-800',
    cyan: 'bg-cyan-800',
    fuchsia: 'bg-fuchsia-800',
    pink: 'bg-pink-800',
    purple: 'bg-purple-800',
    slate: 'bg-slate-800',
    gray: 'bg-gray-800',
    black: 'bg-black'
};

export type ThemeState = {
    density: ThemeDensity;
    backgroundColor: ThemeBackgroundColor;
};

const themeDefaultState: ThemeState = {
    density: 'comfy',
    backgroundColor: 'slate'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: { ...themeDefaultState },
    reducers: {
        setDensity(state, action: PayloadAction<ThemeDensity>) {
            state.density = action.payload;
        },
        setBackgroundColor(state, action: PayloadAction<ThemeBackgroundColor>) {
            state.backgroundColor = action.payload;
        },
        setSettings(state, action: PayloadAction<ThemeState>) {
            state.density = action.payload.density;
            state.backgroundColor = action.payload.backgroundColor;
        }
    }
});

export const themeSelectors = {
    selectDensity: (state: ThemeState) => state.density,
    selectBackgroundColor: (state: ThemeState) => state.backgroundColor,
    selectDensityGapClass: (state: ThemeState) => densityGapMap[state.density],
    selectBackgroundColorClass: (state: ThemeState) => backgroundColorClassMap[state.backgroundColor]
};

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
export const DEFAULT_THEME_STATE = themeDefaultState;
