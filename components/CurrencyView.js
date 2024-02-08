import {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDebouncedCallback} from 'use-debounce';
import {getAllSymbols} from '../services/ApiLayer';

const CurrencyView = () => {
	const [currencyList, setCurrencyList] = useState([]);
	const [euros, setEuros] = useState(0);
	const [conversionResult, setConversionResult] = useState(0);
	const [selectedCurrency, setSelectedCurrency] = useState('USD');

	const debouncedConversionResult = useDebouncedCallback((value) => {
		setConversionResult(value);
	}, 1000);

	useEffect(() => {
		const fetch = async () => {
			try {
				const results = await getAllSymbols();
				//console.log('hello', Object.keys(results));
				if (Object.keys(results).includes('message')) return;
				//console.log('meneekö', results);
				const currencies = [];
				Object.entries(results.rates).forEach((e) => {
					if (e[0] !== 'EUR') {
						return currencies.push({currency: e[0], rate: e[1]});
					}
				});
				//.flat();
				//console.log(currencies);
				return setCurrencyList(currencies);
			} catch (error) {
				return console.log(error.message);
			}
		};
		fetch();
	}, []);

	useEffect(() => {
		//console.log(currencyList);
		if (currencyList.length === 0) return;

		//console.log(euros, conversionResult);
		if (euros === 0 && conversionResult !== 0) {
			//console.log('help');
			return setConversionResult(0);
		}

		if (euros !== 0) {
			const currentSelecton = currencyList.find((e) => e.currency === selectedCurrency);
			//console.log(currentRate);
			const calculation = Math.round((currentSelecton.rate * euros + Number.EPSILON) * 100) / 100;
			return debouncedConversionResult(calculation);
		}
	}, [euros]);

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
				}}
			>
				<Text style={{fontSize: 100, marginBottom: 50}}>{conversionResult}</Text>
				<Text style={{fontSize: 16}}>EUR</Text>
			</View>
			<TextInput
				keyboardType='numeric'
				value={isNaN(euros) ? String(0) : String(euros)}
				onChangeText={(e) => {
					if (isNaN(e) || !e) return setEuros(0);
					return setEuros(parseInt(e));
				}}
				style={{
					width: 200,
					borderBottomWidth: 1,
					borderColor: '#000000',
					textAlign: 'center',
					fontSize: 16,
					marginLeft: 5,
				}}
			/>

			{currencyList && (
				<Picker
					selectedValue={selectedCurrency}
					onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
					style={{width: 200, borderWidth: 1, borderColor: '#000000'}}
				>
					{currencyList.map((entry, index) => (
						<Picker.Item key={index} label={entry.currency} value={entry.currency} />
					))}
				</Picker>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default CurrencyView;
