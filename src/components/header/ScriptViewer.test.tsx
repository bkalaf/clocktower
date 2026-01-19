import { render, screen } from '@testing-library/react';

import { ScriptViewer } from './ScriptViewer';

const script = {
    scriptId: 'script-1',
    name: 'Test Script',
    isBuiltin: true,
    characters: [
        { id: 'char-1', name: 'Detective Mae', team: 'Blue Team', icon: '🕵️' },
        { id: 'char-2', name: 'Agent Iris', team: 'Red Team' }
    ]
};

describe('ScriptViewer', () => {
    it('renders script details when a script is provided', () => {
        render(
            <ScriptViewer
                open
                onOpenChange={() => {}}
                script={script}
            />
        );

        expect(screen.getByText('Test Script')).toBeInTheDocument();
        expect(screen.getByText('Built-in: Yes')).toBeInTheDocument();
        expect(screen.getByText('Detective Mae')).toBeInTheDocument();
        expect(screen.getByText('Blue Team')).toBeInTheDocument();
        expect(screen.getByText('🕵️')).toBeInTheDocument();
        expect(screen.getByText('Agent Iris')).toBeInTheDocument();
        expect(screen.getByText('Red Team')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('does not render anything when no script is provided', () => {
        const { container } = render(
            <ScriptViewer
                open
                onOpenChange={() => {}}
                script={undefined}
            />
        );

        expect(container.firstChild).toBeNull();
    });
});
