/* eslint-disable @typescript-eslint/no-explicit-any */
// src/parserCombinator/domainParser.ts
import {
    andThen,
    applyP,
    lift2,
    many,
    mapP,
    opt,
    orElse,
    Parser,
    pint,
    printResult,
    pstring,
    returnP,
    right,
    run,
    whitespaceChar
} from '.';

const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D, xP: Parser<A>, yP: Parser<B>, zP: Parser<C>): Parser<D> => {
    return applyP(
        applyP(
            applyP(
                returnP((a: A) => (b: B) => (c: C) => f(a, b, c)),
                xP
            ),
            yP
        ),
        zP
    );
};
const assignParser = (x: Parser<Record<string, any>>, y: Parser<Record<string, any>>) =>
    lift2((x: Record<string, any>, y: Record<string, any>) => ({ ...x, ...y }), x, y);
const propertyParser = (key: string, value: string) => returnP({ [key]: value });
const literalParser = (key: string, value: string, literal: string) =>
    right(pstring(value), propertyParser(key, literal));

const valueParser = mapP((x: number) => ({ value: x }), pint);
const ws = many(whitespaceChar);
const plusParser = literalParser('op', '+', 'plus');
const minusParser = literalParser('op', '-', 'plus');
const plusOrMinusParser = orElse(plusParser, minusParser);
const modParser = assignParser(plusOrMinusParser, valueParser);

const characterType = orElse(propertyParser('team', 'outsider'), propertyParser('team', 'outsider'));

const pm = assignParser(modParser, right(ws, characterType));
const parseSurround = <T>(left: string, parser: Parser<T>, right: string) =>
    lift3((left: any, middle: T, right: any) => middle, pstring(left), parser, pstring(right));
const useless = andThen(pstring('there are extra outsider in play.'), ws);
const baron = 
printResult(run(pm, 'there are extra outsider in play. [+2 outsider]'));
