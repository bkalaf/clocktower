import fs from 'graceful-fs';

const dir = '/home/bobby/clocktower/src/machines';

const files = fs.readdirSync(dir);

const fileData: string[] = [];
for (const file of files) {
    console.log(file);
    const fn = [dir, file].join('/');
    const text = fs.readFileSync(fn, 'utf8').toString();
    fileData.push(['*************', fn, '*************', text].join('\n'));
}

console.log(fileData.join('\n'));

fs.writeFileSync('/home/bobby/clocktower/bin/output.txt', fileData.join('\n'));
