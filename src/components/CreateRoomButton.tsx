// src/components/CreateRoomButton.tsx
import { MatchRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function CreateRoomButton() {
    return (
        <MatchRoute
            to='/rooms'
            fuzzy={false}
        >
            <Button asChild>
                <Link to='/rooms/new'>Create Room</Link>
            </Button>
        </MatchRoute>
    );
}
