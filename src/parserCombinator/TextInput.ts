// src/parserCombinator/TextInput.ts
export type Position = {
    line: number;
    column: number;
};

/** define an initial position */
export const initialPos: Position = { line: 0, column: 0 };

/** increment the column number */
export function incrCol(pos: Position): Position {
    return { ...pos, column: pos.column + 1 };
}

/** increment the line number and set the column to 0 */
export function incrLine(pos: Position): Position {
    return { line: pos.line + 1, column: 0 };
}

/** Define the current input state */
export type InputState = {
    lines: string[];
    position: Position;
};

/** return the current line */
export function currentLine(inputState: InputState): string {
    const linePos = inputState.position.line;
    if (linePos < inputState.lines.length) {
        return inputState.lines[linePos];
    }
    return 'end of file';
}

/** Create a new InputState from a string */
export function fromStr(str: string): InputState {
    if (!str) {
        return { lines: [], position: initialPos };
    }
    // split on CRLF or LF, preserving empty lines
    const lines = str.split(/\r\n|\n/);
    return { lines, position: initialPos };
}

/**
 * Get the next character from the input, if any
 * else return null. Also return the updated InputState
 * Signature: InputState -> [InputState, string|null]
 */
export function nextChar(input: InputState): [InputState, string | null] {
    const linePos = input.position.line;
    const colPos = input.position.column;

    // 1) if line >= maxLine -> EOF
    if (linePos >= input.lines.length) {
        return [input, null];
    }

    const line = currentLine(input);

    // 2) if col less than line length -> return char, incr col
    if (colPos < line.length) {
        const ch = line[colPos];
        const newPos = incrCol(input.position);
        const newState: InputState = { ...input, position: newPos };
        return [newState, ch];
    }

    // 3) if col at line length -> return '\n', incr line, reset col
    const newPos = incrLine(input.position);
    const newState: InputState = { ...input, position: newPos };
    return [newState, '\n'];
}
