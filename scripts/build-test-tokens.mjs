import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const entry = path.resolve('src/test-entry.tsx');
const outfile = path.resolve('src/test-bundle.js');

const resolveExtensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];

const assetUrlPlugin = {
    name: 'asset-url-plugin',
    setup(build) {
        build.onLoad({ filter: /.*/, namespace: 'asset-url' }, (args) => {
            const ext = path.extname(args.path).slice(1);
            const mimeType = {
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                svg: 'image/svg+xml'
            }[ext] ?? 'application/octet-stream';
            const content = fs.readFileSync(args.path);

            return {
                loader: 'js',
                contents: `export default ${JSON.stringify(`data:${mimeType};base64,${content.toString('base64')}`)};`
            };
        });
    }
};

const aliasPlugin = {
    name: 'alias-plugin',
    setup(build) {
        build.onResolve({ filter: /^@\// }, (args) => {
            const rawRequest = args.path.slice(2);
            const [requestPath, query] = rawRequest.split('?');
            const hasExtension = path.extname(requestPath) !== '';
            const basePath = path.join(build.initialOptions.absWorkingDir ?? process.cwd(), 'src', requestPath);
            let resolvedPath = basePath;

            if (!fs.existsSync(resolvedPath) && !hasExtension) {
                for (const ext of resolveExtensions) {
                    const candidate = `${resolvedPath}${ext}`;
                    if (fs.existsSync(candidate)) {
                        resolvedPath = candidate;
                        break;
                    }
                }
            }

            const namespace = query === 'url' ? 'asset-url' : undefined;
            return {
                path: resolvedPath,
                namespace
            };
        });
    }
};

esbuild
    .build({
        entryPoints: [entry],
        bundle: true,
        platform: 'browser',
        format: 'esm',
        target: ['chrome110', 'firefox110', 'safari16'],
        outfile,
        sourcemap: 'inline',
        jsx: 'automatic',
        define: {
            'process.env.NODE_ENV': '"development"'
        },
        loader: {
            '.ts': 'ts',
            '.tsx': 'tsx'
        },
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        plugins: [aliasPlugin, assetUrlPlugin]
    })
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
