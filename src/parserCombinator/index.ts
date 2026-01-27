// src/parserCombinator/index.ts
/**
 * ParserLibrary.ts
 *
 * TypeScript port of the F# parser combinator library from:
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators-3/
 *
 * Notes:
 * - This is a fairly direct translation of the original structure.
 * - Parsers operate over an InputState (lines + position).
 * - A Parser<A> wraps a parseFn: (input) => ParseResult<[A, InputState]>
 * - Combinators are provided for sequencing, choice, many, opt, etc.
 *
 * Usage example at bottom (commented).
 */
import * as TextInput from './TextInput';

/* ===========================================
 * Parser core types
 * =========================================== */

export type Input = TextInput.InputState;
export type ParserLabel = string;
export type ParserError = string;

export type ParserPosition = {
    currentLine: string;
    line: number;
    column: number;
};

export type ParseResult<A> =
    | { tag: 'Success'; value: A }
    | { tag: 'Failure'; label: ParserLabel; error: ParserError; position: ParserPosition };

export type Parser<A> = {
    parseFn: (input: Input) => ParseResult<[A, Input]>;
    label: ParserLabel;
};

/** Run the parser on a InputState */
export function runOnInput<A>(parser: Parser<A>, input: Input): ParseResult<[A, Input]> {
    return parser.parseFn(input);
}

/** Run the parser on a string */
export function run<A>(parser: Parser<A>, inputStr: string): ParseResult<[A, Input]> {
    return runOnInput(parser, TextInput.fromStr(inputStr));
}

/* ===========================================
 * Error messages / printing
 * =========================================== */

export function parserPositionFromInputState(inputState: Input): ParserPosition {
    return {
        currentLine: TextInput.currentLine(inputState),
        line: inputState.position.line,
        column: inputState.position.column
    };
}

export function printResult<A>(result: ParseResult<[A, Input]>): void {
    if (result.tag === 'Success') {
        // eslint-disable-next-line no-console
        console.log(result.value[0]);
        return;
    }

    const { label, error, position } = result;
    const errorLine = position.currentLine;
    const colPos = position.column;
    const linePos = position.line;

    const caret = ' '.repeat(Math.max(0, colPos)) + '^' + error;
    // eslint-disable-next-line no-console
    console.log(`Line:${linePos} Col:${colPos} Error parsing ${label}\n${errorLine}\n${caret}`);
}

/* ===========================================
 * Label related
 * =========================================== */

export function getLabel<A>(parser: Parser<A>): ParserLabel {
    return parser.label;
}

export function setLabel<A>(parser: Parser<A>, newLabel: ParserLabel): Parser<A> {
    const newInnerFn = (input: Input): ParseResult<[A, Input]> => {
        const result = parser.parseFn(input);
        if (result.tag === 'Success') return result;
        return { ...result, label: newLabel };
    };

    return { parseFn: newInnerFn, label: newLabel };
}

/* ===========================================
 * Standard combinators
 * =========================================== */

/** Match an input token if the predicate is satisfied */
export function satisfy(predicate: (ch: string) => boolean, label: ParserLabel): Parser<string> {
    const innerFn = (input: Input): ParseResult<[string, Input]> => {
        const [remainingInput, chOpt] = TextInput.nextChar(input);

        if (chOpt === null) {
            const err = 'No more input';
            const pos = parserPositionFromInputState(input);
            return { tag: 'Failure', label, error: err, position: pos };
        }

        const first = chOpt;
        if (predicate(first)) {
            return { tag: 'Success', value: [first, remainingInput] };
        }

        const err = `Unexpected '${first}'`;
        const pos = parserPositionFromInputState(input);
        return { tag: 'Failure', label, error: err, position: pos };
    };

    return { parseFn: innerFn, label };
}

/**
 * bindP takes a parser-producing function f, and a parser p
 * and passes the output of p into f, to create a new parser
 */
export function bindP<A, B>(f: (a: A) => Parser<B>, p: Parser<A>): Parser<B> {
    const label = 'unknown';
    const innerFn = (input: Input): ParseResult<[B, Input]> => {
        const result1 = runOnInput(p, input);
        if (result1.tag === 'Failure') {
            return { tag: 'Failure', label: result1.label, error: result1.error, position: result1.position };
        }

        const [value1, remainingInput] = result1.value;
        const p2 = f(value1);
        return runOnInput(p2, remainingInput);
    };

    return { parseFn: innerFn, label };
}

/** Lift a value to a Parser */
export function returnP<A>(x: A): Parser<A> {
    const label = String(x);
    const innerFn = (input: Input): ParseResult<[A, Input]> => ({ tag: 'Success', value: [x, input] });
    return { parseFn: innerFn, label };
}

/** apply a function to the value inside a parser */
export function mapP<A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> {
    return bindP((a) => returnP(f(a)), p);
}

/** apply a wrapped function to a wrapped value */
export function applyP<A, B>(fP: Parser<(a: A) => B>, xP: Parser<A>): Parser<B> {
    return bindP((f) => bindP((x) => returnP(f(x)), xP), fP);
}

/** lift a two parameter function to Parser World */
export function lift2<A, B, C>(f: (a: A, b: B) => C, xP: Parser<A>, yP: Parser<B>): Parser<C> {
    return applyP(
        applyP(
            returnP((a: A) => (b: B) => f(a, b)),
            xP
        ),
        yP
    );
}

/** Combine two parsers as "A andThen B" */
export function andThen<A, B>(p1: Parser<A>, p2: Parser<B>): Parser<[A, B]> {
    const label = `${getLabel(p1)} andThen ${getLabel(p2)}`;
    const combined = bindP((a) => bindP((b) => returnP<[A, B]>([a, b]), p2), p1);
    return setLabel(combined, label);
}

/** Combine two parsers as "A orElse B" */
export function orElse<A>(p1: Parser<A>, p2: Parser<A>): Parser<A> {
    const label = `${getLabel(p1)} orElse ${getLabel(p2)}`;
    const innerFn = (input: Input): ParseResult<[A, Input]> => {
        const result1 = runOnInput(p1, input);
        if (result1.tag === 'Success') return result1;
        return runOnInput(p2, input);
    };
    return { parseFn: innerFn, label };
}

/** Choose any of a list of parsers */
export function choice<A>(parsers: Parser<A>[]): Parser<A> {
    if (parsers.length === 0) {
        throw new Error('choice requires at least one parser');
    }
    return parsers.reduce((acc, p) => orElse(acc, p));
}

export function sequence<A>(parserList: Parser<A>[]): Parser<A[]> {
    const cons = (head: A, tail: A[]) => [head, ...tail];
    const consP = (headP: Parser<A>, tailP: Parser<A[]>) => lift2(cons, headP, tailP);

    if (parserList.length === 0) {
        return returnP<A[]>([]);
    }
    const [head, ...tail] = parserList;
    return consP(head, sequence(tail));
}

/** (helper) match zero or more occurrences of the specified parser */
function parseZeroOrMore<A>(parser: Parser<A>, input: Input): [A[], Input] {
    const firstResult = runOnInput(parser, input);
    if (firstResult.tag === 'Failure') {
        return [[], input];
    }

    const [firstValue, inputAfterFirstParse] = firstResult.value;
    const [subsequentValues, remainingInput] = parseZeroOrMore(parser, inputAfterFirstParse);
    return [[firstValue, ...subsequentValues], remainingInput];
}

/** matches zero or more occurrences of the specified parser */
export function many<A>(parser: Parser<A>): Parser<A[]> {
    const label = `many ${getLabel(parser)}`;
    const innerFn = (input: Input): ParseResult<[A[], Input]> => ({
        tag: 'Success',
        value: parseZeroOrMore(parser, input)
    });
    return { parseFn: innerFn, label };
}

/** matches one or more occurrences of the specified parser */
export function many1<A>(p: Parser<A>): Parser<A[]> {
    const label = `many1 ${getLabel(p)}`;
    const combined = bindP((head) => bindP((tail) => returnP([head, ...tail]), many(p)), p);
    return setLabel(combined, label);
}

/** Parses an optional occurrence of p and returns a value or null. */
export function opt<A>(p: Parser<A>): Parser<A | null> {
    const label = `opt ${getLabel(p)}`;
    const some = mapP((x: A) => x, p);
    const none = returnP<A | null>(null);
    // map "some" to non-null, keep none as null
    const someAsOpt = mapP((x: A) => x as A, some);
    return setLabel(orElse(someAsOpt, none), label);
}

/** Keep only the result of the left side parser */
export function left<A, B>(p1: Parser<A>, p2: Parser<B>): Parser<A> {
    return mapP(([a]) => a, andThen(p1, p2));
}

/** Keep only the result of the right side parser */
export function right<A, B>(p1: Parser<A>, p2: Parser<B>): Parser<B> {
    return mapP(([, b]) => b, andThen(p1, p2));
}

/** Keep only the result of the middle parser */
export function between<A, B, C>(p1: Parser<A>, p2: Parser<B>, p3: Parser<C>): Parser<B> {
    return left(right(p1, p2), p3);
}

/** Parses one or more occurrences of p separated by sep */
export function sepBy1<A, S>(p: Parser<A>, sep: Parser<S>): Parser<A[]> {
    const sepThenP = right(sep, p);
    return mapP(([head, tail]) => [head, ...tail], andThen(p, many(sepThenP)));
}

/** Parses zero or more occurrences of p separated by sep */
export function sepBy<A, S>(p: Parser<A>, sep: Parser<S>): Parser<A[]> {
    return orElse(sepBy1(p, sep), returnP<A[]>([]));
}

/* ===========================================
 * Standard parsers
 * =========================================== */

/** parse a char */
export function pchar(charToMatch: string): Parser<string> {
    if (charToMatch.length !== 1) throw new Error('pchar expects a single character');
    const label = charToMatch;
    return satisfy((ch) => ch === charToMatch, label);
}

/** Choose any of a list of characters */
export function anyOf(listOfChars: string[]): Parser<string> {
    const label = `anyOf ${JSON.stringify(listOfChars)}`;
    const parsers = listOfChars.map((c) => pchar(c));
    return setLabel(choice(parsers), label);
}

/** Convert a list of chars to a string */
export function charListToStr(charList: string[]): string {
    return charList.join('');
}

/** Parses a sequence of zero or more chars with the char parser cp. Returns a string. */
export function manyChars(cp: Parser<string>): Parser<string> {
    return mapP(charListToStr, many(cp));
}

/** Parses a sequence of one or more chars with the char parser cp. Returns a string. */
export function manyChars1(cp: Parser<string>): Parser<string> {
    return mapP(charListToStr, many1(cp));
}

/** parse a specific string */
export function pstring(str: string): Parser<string> {
    const label = str;
    const parsers = Array.from(str).map((ch) => pchar(ch));
    const p = mapP(charListToStr, sequence(parsers));
    return setLabel(p, label);
}

/* ------------------------------
 * whitespace parsing
 * ------------------------------ */

/** parse a whitespace char */
export const whitespaceChar: Parser<string> = satisfy((ch) => /\s/.test(ch), 'whitespace');

/** parse zero or more whitespace char */
export const spaces: Parser<string[]> = many(whitespaceChar);

/** parse one or more whitespace char */
export const spaces1: Parser<string[]> = many1(whitespaceChar);

/* ------------------------------
 * number parsing
 * ------------------------------ */

/** parse a digit */
export const digitChar: Parser<string> = satisfy((ch) => /[0-9]/.test(ch), 'digit');

/** parse an integer */
export const pint: Parser<number> = (() => {
    const label = 'integer';

    const digits = manyChars1(digitChar); // string of digits
    const sign = opt(pchar('-')); // '-' or null

    const resultToInt = (pair: [string | null, string]): number => {
        const [signCh, digitStr] = pair;
        const i = parseInt(digitStr, 10);
        return signCh ? -i : i;
    };

    const p = mapP(resultToInt, andThen(sign, digits));
    return setLabel(p, label);
})();

/** parse a float (no exponent support, matches F# behavior) */
export const pfloat: Parser<number> = (() => {
    const label = 'float';

    const digits = manyChars1(digitChar); // string of digits
    const sign = opt(pchar('-'));
    const point = pchar('.');

    // shape: (((sign,d1),point),d2)
    const combined = andThen(andThen(andThen(sign, digits), point), digits);

    const resultToFloat = (nested: [[[string | null, string], string], string]): number => {
        const [[[signCh, d1], _dot], d2] = nested;
        const fl = parseFloat(`${d1}.${d2}`);
        return signCh ? -fl : fl;
    };

    const p = mapP(resultToFloat, combined);
    return setLabel(p, label);
})();

/* ===========================================
 * Example (uncomment to try in Node)
 * =========================================== */

const parser = pint;
const result = run(parser, '-123\n456');
printResult(result);

const fparser = pfloat;
printResult(run(fparser, '-12.34'));
