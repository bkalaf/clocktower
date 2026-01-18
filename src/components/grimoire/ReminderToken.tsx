// src/components/grimoire/ReminderToken.tsx
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import * as React from 'react';

export type ReminderTokenMeta = {
    key: string;
    label: string;
    color: string;
    icon?: string;
    description?: string;
};

export type ReminderTokenProps = {
    reminder: ReminderTokenMeta;
    size?: number;
    draggableId?: string;
    instanceId?: string;
    className?: string;
    style?: React.CSSProperties;
};

export function ReminderToken({
    reminder,
    size = 34,
    draggableId,
    instanceId,
    className
}: ReminderTokenProps) {
    const isDraggable = typeof draggableId === 'string';
    const uniqueId = isDraggable
        ? draggableId
        : `reminder-overlay-${instanceId ?? reminder.key}`;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: uniqueId,
        disabled: !isDraggable
    });

    const dragStyle: React.CSSProperties = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
          }
        : {};

    return (
        <span
            ref={setNodeRef}
            className={cn(
                'flex items-center justify-center rounded-full border border-white/30 bg-gradient-to-tr from-slate-900/90 to-black/60 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition-all',
                isDragging && 'shadow-[0_0_25px_rgba(255,255,255,0.45)] scale-110',
                className
            )}
            style={{
                width: size,
                height: size,
                backgroundColor: reminder.color,
                ...dragStyle,
                ...style
            }}
            {...(isDraggable ? { ...attributes, ...listeners } : {})}
        >
            {reminder.icon ?? reminder.label.charAt(0)}
        </span>
    );
}
