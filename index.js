const fs = require('fs');
const readline = require('readline');
let ProgressBar = require('progress');

const sourcePath = 'D:/rockyou2021/rockyou2021.txt';
const { size: fileSize } = fs.statSync(sourcePath);
let state = { current: 1, fileCount: 1 };
// Кол-во паролей в одном файле
const generalPassCounter = 30000000;
let bytesRead = 0;
let bufferArr = [];

// Шаблон для прогрессбара
const tmplOverall = 'Reading pass file: [:bar] :percent(:curren / :total)';
const initState = {
	complete: '#',
	incomplete: '-',
	width: 40,
	total: fileSize
}
let barOverall = new ProgressBar(tmplOverall, initState);

const readInterface = readline.createInterface({
	input: fs.createReadStream(sourcePath)
});

readInterface.on('line', handleLine);

readInterface.on('close', () => {
	writeToFile();
	console.log("\nFinish!");
});




function handleLine(line) {
	try {
		if (process.argv[2] === undefined) {
			bufferArr.push(line);
		} else {
			if (state.fileCount >= process.argv[2]) {
				bufferArr.push(line);
			}
		}

		if (process.argv[2] !== undefined) {

			if (state.fileCount >= process.argv[2]) {
				if (bufferArr.length === generalPassCounter) {
					writeToFile();
					restartPosition();
				}
			} else {
				if (state.current === generalPassCounter) {
					restartPosition();
				}
			}

		} else if (bufferArr.length === generalPassCounter) {
			writeToFile();
			restartPosition();
		}

		state.current++;
		bytesRead += line.length;
		barOverall.curr = bytesRead;
		barOverall.tick({ curren: bytesRead });

	} catch (err) {
		console.log("Error occured ->:", err);
	}
}

function writeToFile() {
	console.log(`\nWriting to ${state.fileCount}.txt...`);
	if (!fs.existsSync('passwords')) fs.mkdirSync('./passwords', err => console.log(err));
	fs.writeFileSync(`passwords/${state.fileCount}.txt`, bufferArr.join('\r'));
}

function restartPosition() {
	bufferArr = [];
	state.current = 0;
	state.fileCount++;
}