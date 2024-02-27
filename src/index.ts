let inputSearch = document.querySelector('.input-search') as HTMLInputElement;
let btnCountries = document.querySelector('.btn-countries');
let searchBtn = document.querySelector('.search-btn');
let statisticsList = document.querySelector('.statistics-list');
let searchContainer = document.querySelector('.search-div') as HTMLElement;
let allCountiresContainer = document.querySelector(
	'.all-countries-div'
) as HTMLElement;
let tableCurrenciesContainer = document.querySelector(
	'.table-currencies-div'
) as HTMLElement;
let regionContainer = document.querySelector('.region-div') as HTMLElement;
let countryNameKey = 'Country Name';
let countryPopulationKey = 'Number of citizens';

class CountriesNames {
	common: string;
	official: string;
	nativeName: Object;
	constructor(common: string, official: string, nativeName: Object) {
		this.common = common;
		this.official = official;
		this.nativeName = nativeName;
	}
}

class Countries {
	name: CountriesNames;
	altSpellings: string[];
	population: string;
	region: string;
	currencies: Currencies;
	constructor(
		name: CountriesNames,
		altSpellings: string[],
		population: string,
		region: string,
		currencies: Currencies
	) {
		this.name = name;
		this.altSpellings = altSpellings;
		this.population = population;
		this.region = region;
		this.currencies = currencies;
	}
}

class Currencies {
	name: string;
	symbol: string;
	constructor(name: string, symbol: string) {
		this.name = name;
		this.symbol = symbol;
	}
}

async function getAllCountries(): Promise<Countries[]> {
	let response = await fetch('https://restcountries.com/v3.1/all');
	let countries = await response.json();
	return countries;
}

const countryRenderer = (country: Countries, index: number) => {
	if (index === 0) {
		renderRow(searchContainer, countryNameKey, countryPopulationKey);
	}
	renderRow(searchContainer, country.name.common, country.population);
};

const populationReducer = (totalPopulation: number, country: Countries) => {
	return totalPopulation + country.population;
};

const onSearch = async () => {
	let response = await fetch(
		`https://restcountries.com/v3.1/name/${inputSearch.value}`
	);
	let countries = await response.json();
	let count = countries.length;
	let initialValue = 0;

	countries.forEach(countryRenderer);
	const population = countries.reduce(populationReducer, 0);
	let avgPopulation = initialValue / count;
	renderStatistics(count, population, avgPopulation);
	uploadStatstoTable(countries, count);
	let currencies = getCurrenciesCountries(countries);
	Object.entries(currencies).forEach(
		([key, value]: [key: string, value: string]) =>
			renderRow(tableCurrenciesContainer, key, value)
	);
};

const onClickAllCountries = async () => {
	let countries = await getAllCountries();

	countries.forEach((country, index) => {
		if (index === 0) {
			renderRow(allCountiresContainer, countryNameKey, countryPopulationKey);
		}
		renderRow(allCountiresContainer, country.name.common, country.population);
	});
};
function renderRow(
	container: HTMLElement,
	firstCell: string,
	secondCell: string
) {
	let tr = document.createElement('tr');
	let table = container.querySelector('table') as HTMLElement;
	let tbody = container.querySelector('tbody') as HTMLElement;
	let thead = container.querySelector('thead') as HTMLElement;
	let tdfirst = document.createElement('td');
	tdfirst.innerText = firstCell;
	tr.appendChild(tdfirst);
	tbody.appendChild(tr);
	let tdsecond = document.createElement('td');
	tdsecond.innerText = secondCell;
	tr.appendChild(tdsecond);
	tbody.appendChild(tr);
	table.appendChild(thead);
	table.appendChild(tbody);
	container.appendChild(table);
}

function uploadStatstoTable(countries: Countries[], count: number) {
	let regionCounts: { [key: string]: number } = {};
	let regionName = 'Region';
	let regionNumber = 'Region number';
	for (let i = 0; i < count; i++) {
		let region = countries[i].region;
		regionCounts[region] = (regionCounts[region] || 0) + 1;
	}
	renderRow(regionContainer, regionName, regionNumber);
	for (let region in regionCounts) {
		renderRow(regionContainer, region, String(regionCounts[region]));
	}
}

function renderStatistics(count: number, pop: number, avg: number) {
	let liTotalCountries = document.createElement('li');
	let liTotalPopulation = document.createElement('li');
	let liAvgPopulation = document.createElement('li');
	liTotalCountries.innerHTML = `Total Countries: ${count}`;
	liTotalPopulation.innerHTML = `Total Population: ${pop}`;
	liAvgPopulation.innerHTML = `Average Population: ${avg}`;
	statisticsList?.appendChild(liTotalCountries);
	statisticsList?.appendChild(liTotalPopulation);
	statisticsList?.appendChild(liAvgPopulation);
}

function getCurrenciesCountries(countries: Countries[]): Object {
	let currencyCounts: { [key: string]: number } = {};
	countries.forEach((country) => {
		let currencies = Object.keys(country.currencies)[0];
		if (!currencyCounts[currencies]) {
			currencyCounts[currencies] = 1;
		} else {
			currencyCounts[currencies]++;
		}
	});
	return currencyCounts;
}

searchBtn?.addEventListener('click', onSearch);
btnCountries?.addEventListener('click', onClickAllCountries);
