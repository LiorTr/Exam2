"use strict";
let inputSearch = document.querySelector('.input-search');
let btnCountries = document.querySelector('.btn-countries');
let searchBtn = document.querySelector('.search-btn');
let statisticsList = document.querySelector('.statistics-list');
let searchContainer = document.querySelector('.search-div');
let allCountiresContainer = document.querySelector('.all-countries-div');
let tableCurrenciesContainer = document.querySelector('.table-currencies-div');
let regionContainer = document.querySelector('.region-div');
let countryNameKey = 'Country Name';
let countryPopulationKey = 'Number of citizens';
class CountriesNames {
    constructor(common, official, nativeName) {
        this.common = common;
        this.official = official;
        this.nativeName = nativeName;
    }
}
class Countries {
    constructor(name, altSpellings, population, region, currencies) {
        this.name = name;
        this.altSpellings = altSpellings;
        this.population = population;
        this.region = region;
        this.currencies = currencies;
    }
}
class Currencies {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}
async function getAllCountries() {
    let response = await fetch('https://restcountries.com/v3.1/all');
    let countries = await response.json();
    return countries;
}
const countryRenderer = (country, index) => {
    if (index === 0) {
        renderRow(searchContainer, countryNameKey, countryPopulationKey);
    }
    renderRow(searchContainer, country.name.common, country.population);
};
const populationReducer = (totalPopulation, country) => {
    return totalPopulation + country.population;
};
const onSearch = async () => {
    let response = await fetch(`https://restcountries.com/v3.1/name/${inputSearch.value}`);
    let countries = await response.json();
    let count = countries.length;
    let initialValue = 0;
    countries.forEach(countryRenderer);
    const population = countries.reduce(populationReducer, 0);
    let avgPopulation = initialValue / count;
    renderStatistics(count, population, avgPopulation);
    uploadStatstoTable(countries, count);
    let currencies = getCurrenciesCountries(countries);
    Object.entries(currencies).forEach(([key, value]) => renderRow(tableCurrenciesContainer, key, value));
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
function renderRow(container, firstCell, secondCell) {
    let tr = document.createElement('tr');
    let table = container.querySelector('table');
    let tbody = container.querySelector('tbody');
    let thead = container.querySelector('thead');
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
function uploadStatstoTable(countries, count) {
    let regionCounts = {};
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
function renderStatistics(count, pop, avg) {
    let liTotalCountries = document.createElement('li');
    let liTotalPopulation = document.createElement('li');
    let liAvgPopulation = document.createElement('li');
    liTotalCountries.innerHTML = `Total Countries: ${count}`;
    liTotalPopulation.innerHTML = `Total Population: ${pop}`;
    liAvgPopulation.innerHTML = `Average Population: ${avg}`;
    statisticsList === null || statisticsList === void 0 ? void 0 : statisticsList.appendChild(liTotalCountries);
    statisticsList === null || statisticsList === void 0 ? void 0 : statisticsList.appendChild(liTotalPopulation);
    statisticsList === null || statisticsList === void 0 ? void 0 : statisticsList.appendChild(liAvgPopulation);
}
function getCurrenciesCountries(countries) {
    let currencyCounts = {};
    countries.forEach((country) => {
        let currencies = Object.keys(country.currencies)[0];
        if (!currencyCounts[currencies]) {
            currencyCounts[currencies] = 1;
        }
        else {
            currencyCounts[currencies]++;
        }
    });
    return currencyCounts;
}
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', onSearch);
btnCountries === null || btnCountries === void 0 ? void 0 : btnCountries.addEventListener('click', onClickAllCountries);
