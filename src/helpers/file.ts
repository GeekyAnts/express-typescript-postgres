import fs from "fs"

export const createFile = async (basePath: string, filename: string, content: string) => {
	if (!fs.existsSync(basePath)) {
		fs.mkdirSync(basePath)
	}

	let fileDescriptor = fs.openSync(basePath + filename, 'w')
	fs.appendFileSync(fileDescriptor, content, 'utf8')
	if (fileDescriptor !== undefined)
		fs.closeSync(fileDescriptor)

	return true
}
