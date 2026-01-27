//scripts/tokenTypes.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IToken<TText extends string, T, TValues extends undefined | Record<string, any> = undefined> {
    token: TText;
    for: T;
    values?: TValues;
    comparator(left: T, right: T): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IRegExpToken<TText extends string, T extends Record<string, any>> = IToken<TText, string, T | undefined>;
export type BiGramToken<TText extends string> = IToken<TText, [string, string]>;
export type TriGramToken<TText extends string> = IToken<TText, [string, string, string]>;
