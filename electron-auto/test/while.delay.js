function  delay(time) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}
async function main() {
	const max = 5
	let index = 0
	while (index < max) {
		await delay(1000 * 5);
		if (index === 3) {
			return
		}
		console.log('while:', index)
		index = index + 1
	}
}
main()
