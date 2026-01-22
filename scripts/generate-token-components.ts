// scripts/generate-token-components.ts
import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');
const tokensBaseDir = path.join(projectRoot, 'src', 'components', 'tokens');
const iconsComponentDir = path.join(projectRoot, 'src', 'components', 'icons');
const iconsAssetDir = path.join(projectRoot, 'src', 'assets', 'icons');
const dataFiles = [
    path.join(projectRoot, 'src', 'assets', 'data', 'roles.json'),
    path.join(projectRoot, 'src', 'assets', 'data', 'fabled.json')
];

function toPascalCase(value: string) {
    return value
        .replace(/[^a-z0-9]+/gi, ' ')
        .split(' ')
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment) => segment[0].toUpperCase() + segment.slice(1).toLowerCase())
        .join('');
}

function toSnakeCase(value: string) {
    return value
        .toLowerCase()
        .replace(/[’'`]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
}

async function ensureCleanDirectory(directory: string) {
    await fs.rm(directory, { recursive: true, force: true });
    await fs.mkdir(directory, { recursive: true });
}

async function writeFile(filePath: string, content: string) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content.trimStart() + '\n', 'utf8');
}

async function generateIconComponents() {
    const iconFiles = await fs.readdir(iconsAssetDir);
    await ensureCleanDirectory(iconsComponentDir);
    const exports: string[] = [];
    for (const iconFile of iconFiles) {
        const extension = path.extname(iconFile).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(extension)) continue;
        const iconName = path.basename(iconFile, extension);
        const componentName = `${toPascalCase(iconName)}Icon`;
        const filePath = path.join(iconsComponentDir, `${componentName}.tsx`);
        const title = iconName.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        const fileContent = `// src/components/icons/${componentName}.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/${iconFile}?url';

export type ${componentName}Props = React.ImgHTMLAttributes<HTMLImageElement>;

export function ${componentName}({ className, alt, ...props }: ${componentName}Props) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? '${title} icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ${componentName};
`;
        await writeFile(filePath, fileContent);
        exports.push(`export { ${componentName} } from './${componentName}';`);
    }
    const indexContent = `// src/components/icons/index.ts
${exports.join('\n')}
`;
    await writeFile(path.join(iconsComponentDir, 'index.ts'), indexContent);
}

type RoleDefinition = {
    id: string;
    name: string;
    reminders?: string[];
    remindersGlobal?: string[];
};

async function loadRoles() {
    const allRoles: RoleDefinition[] = [];
    for (const filePath of dataFiles) {
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed: RoleDefinition[] = JSON.parse(raw);
        allRoles.push(...parsed);
    }
    return allRoles;
}

async function generateTokenDirectory(role: RoleDefinition) {
    const roleDir = path.join(tokensBaseDir, role.id);
    await ensureCleanDirectory(roleDir);
    const iconFile = `${role.id}.png`;
    const tokenComponentName = `${toPascalCase(role.id)}Token`;
    const tokenFilePath = path.join(roleDir, 'Token.tsx');
    const tokenImports = `// src/components/tokens/${role.id}/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/${iconFile}?url';

export type ${tokenComponentName}Props = Omit<TokenProps, 'name' | 'image'>;

export function ${tokenComponentName}(props: ${tokenComponentName}Props) {
    return <Token name='${role.name}' image={iconSrc} {...props} />;
}

export default ${tokenComponentName};
`;
    await writeFile(tokenFilePath, tokenImports);

    const reminders = new Set<string>();
    [...(role.reminders ?? []), ...(role.remindersGlobal ?? [])].forEach((reminder) => {
        if (typeof reminder === 'string' && reminder.trim()) {
            reminders.add(reminder.trim());
        }
    });

    for (const reminder of reminders) {
        const snake = toSnakeCase(reminder);
        if (!snake) continue;
        const fileName = `Reminder_${role.id}_${snake}.tsx`;
        const componentName = `Reminder${toPascalCase(role.id)}${toPascalCase(snake)}`;
        const reminderFilePath = path.join(roleDir, fileName);
        const reminderContent = `// src/components/tokens/${role.id}/${fileName}

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/${iconFile}?url';

const reminderMeta = {
    key: '${role.id}_${snake}',
    label: '${reminder}',
    backgroundImage: iconSrc
};

export type ${componentName}Props = Omit<ReminderTokenProps, 'reminder'>;

export function ${componentName}(props: ${componentName}Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ${componentName};
`;
        await writeFile(reminderFilePath, reminderContent);
    }
}

async function generateTokenComponents() {
    const roles = await loadRoles();
    await fs.mkdir(tokensBaseDir, { recursive: true });
    for (const role of roles) {
        await generateTokenDirectory(role);
    }
}

async function main() {
    await generateIconComponents();
    await generateTokenComponents();
    console.log('Token components and icon helpers generated.');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
