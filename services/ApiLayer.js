const getAllSymbols = async () => {
	//console.log(process.env.EXPO_PUBLIC_APILAYER_APIKEY);
	//console.log(process.env.NONPUBLIC_APILAYER_APIKEY);
	//non public .env-keyt ei toimi ilman lisäkonfiguraatiota
	//https://api.apilayer.com/exchangerates_data/latest
	//https://api.apilayer.com/exchangerates_data/symbols
	const newHeaders = new Headers();
	newHeaders.append('apikey', process.env.EXPO_PUBLIC_APILAYER_APIKEY);
	try {
		const results = await fetch(`https://api.apilayer.com/exchangerates_data/latest`, {
			method: 'GET',
			redirect: 'follow',
			headers: newHeaders,
		});
		return results.json();
	} catch (error) {
		return error;
	}
};

export {getAllSymbols};
