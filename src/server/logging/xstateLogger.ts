import type { ActorRef, EventObject } from 'xstate';
import { appendLog } from './diskLogger';
import { safeSerialize, summarizePayload } from './logUtils';

interface InstrumentOptions {
    logDir?: string;
    machineName: string;
    machineId?: string;
    serviceName?: string;
}

export function instrumentXStateActor(actor: ActorRef<any, EventObject, EventObject>, options: InstrumentOptions) {
    const { logDir, machineName, machineId, serviceName = 'xstate' } = options;
    if (!logDir) {
        return;
    }

    const actorMeta: Record<string, unknown> = {
        service: serviceName,
        machineName
    };
    if (machineId) {
        actorMeta.machineId = machineId;
    }
    if (actor.sessionId) {
        actorMeta.actorSessionId = actor.sessionId;
    }
    if (actor.id) {
        actorMeta.actorRefId = actor.id;
    }

    const log = (entry: Record<string, unknown>) => {
        void appendLog(logDir, { ...actorMeta, ...entry });
    };

    log({ type: 'machine_created' });

    let lastEventType: string | undefined;
    let previousStateValue: string | undefined;
    try {
        const snapshot = actor.getSnapshot();
        previousStateValue = safeSerialize(snapshot.value, 256);
    } catch {
        previousStateValue = undefined;
    }

    const subscription = actor.subscribe((state) => {
        const currentValue = safeSerialize(state.value, 256);
        if (previousStateValue === undefined) {
            previousStateValue = currentValue;
            return;
        }
        if (previousStateValue === currentValue) {
            return;
        }

        const actions = collectActionNames(state as Record<string, unknown>);
        log({
            type: 'state_transition',
            event: lastEventType ?? 'unknown',
            from: previousStateValue,
            to: currentValue,
            actions: actions.length > 0 ? actions : undefined
        });
        previousStateValue = currentValue;
        lastEventType = undefined;
    });

    const originalStart = actor.start.bind(actor);
    const startWrapper = (...args: Parameters<typeof actor.start>) => {
        log({ type: 'interpreter_start' });
        return originalStart(...args);
    };
    actor.start = startWrapper as typeof actor.start;

    const originalStop = actor.stop.bind(actor);
    const stopWrapper = (...args: Parameters<typeof actor.stop>) => {
        log({ type: 'interpreter_stop' });
        const result = originalStop(...args);
        subscription.unsubscribe();
        return result;
    };
    actor.stop = stopWrapper as typeof actor.stop;

    const originalSend = actor.send.bind(actor);
    const sendWrapper = (event: Parameters<typeof actor.send>[0]) => {
        const eventType = typeof event === 'string' ? event : (event?.type as string | undefined) ?? 'unknown';
        lastEventType = eventType;
        log({
            type: 'event_received',
            event: eventType,
            payloadSummary: summarizePayload(event, 512)
        });
        return originalSend(event);
    };
    actor.send = sendWrapper as typeof actor.send;
}

function collectActionNames(state: Record<string, unknown>) {
    const nodes = (
        (state as { _nodes?: Array<Record<string, unknown>> })._nodes ?? []
    ) as Array<Record<string, unknown>>;
    const names = new Set<string>();
    for (const node of nodes) {
        const entries = node.entry as Array<Record<string, unknown>> | undefined;
        const exits = node.exit as Array<Record<string, unknown>> | undefined;
        if (entries) {
            for (const action of entries) {
                if (action?.type) {
                    names.add(String(action.type));
                } else {
                    names.add('inline');
                }
            }
        }
        if (exits) {
            for (const action of exits) {
                if (action?.type) {
                    names.add(String(action.type));
                } else {
                    names.add('inline');
                }
            }
        }
    }
    return Array.from(names);
}
