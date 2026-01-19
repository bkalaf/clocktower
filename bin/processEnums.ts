import fs from 'graceful-fs';
import * as enums from '../src/schemas/enums/_enums';
import { camelCaseToProperCase, surroundDblQuote } from '../src/utils/text';

const output: string[] = [];
for (const [name, values] of Object.entries(enums)) {
    if (name.includes('Count')) {
        const text = `export type ${camelCaseToProperCase(name).replaceAll(' ', '')} = ${values
            .map((x) => (x as number).toFixed(0))
            .join(' | ')
            .concat(';')}`;
        output.push(text);
        continue;
    }
    const text = `export type ${camelCaseToProperCase(name).replaceAll(' ', '')} = ${values
        .map((s) => surroundDblQuote(s as string))
        .join(' | ')
        .concat(';')}`;
    output.push(text);
}

fs.writeFileSync('/home/bobby/clocktower/bin/enums.ts', output.join('\n'));
