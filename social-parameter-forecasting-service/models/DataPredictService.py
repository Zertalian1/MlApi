from statsmodels.tsa.arima.model import ARIMAResults
from domain.models import Input


class DataPredictService:
    def __init__(self):
        self.population_pred = ARIMAResults.load(
            './models/arima/population.pkl'
        )
        self.unemployment_rate_pred = ARIMAResults.load(
            './models/arima/unemployment-rate.pkl'
        )
        self.life_expectancy_pred = ARIMAResults.load(
            './models/arima/life-expectancy.pkl'
        )
        self.government_agr_or_pred = ARIMAResults.load(
            './models/arima/government-agriculture-orientation.pkl'
        )
        self.gini_coef_pred = ARIMAResults.load(
            './models/arima/gini-coefficient-after-tax-wid.pkl'
        )
        self.gdp_pred = ARIMAResults.load(
            './models/arima/gdp-per-capita.pkl'
        )
        self.contr_temp_rise_pred = ARIMAResults.load(
            './models/arima/contribution-temp-rise-degrees.pkl'
        )

    def predict_input(self, year: int):
        product = Input()
        last_data_index = 55 + year - 2015
        product.year = year
        product.population = self.population_pred.forecast(year - 2015)[last_data_index]
        product.unemployment = self.unemployment_rate_pred.forecast(year - 2015)[last_data_index]
        product.life_expectancy = self.life_expectancy_pred.forecast(year - 2015)[last_data_index]
        product.agriculture_orientation = self.government_agr_or_pred.forecast(year - 2015)[last_data_index]
        product.gini = self.gini_coef_pred.forecast(year - 2015)[last_data_index]
        product.gdp = self.gdp_pred.forecast(year - 2015)[last_data_index]
        product.surface_temperature_change = self.contr_temp_rise_pred.forecast(year - 2015)[last_data_index]
        return product

    def predict_input_interval(self, year_from: int, year_to: int):
        start_data_index = 55 + year_from - 2015
        end_data_index = 55 + year_to - 2015

        population = self.population_pred.forecast(year_to - 2015)
        unemployment = self.unemployment_rate_pred.forecast(year_to - 2015)
        life_expectancy = self.life_expectancy_pred.forecast(year_to - 2015)
        agriculture_orientation = self.government_agr_or_pred.forecast(year_to - 2015)
        gini = self.gini_coef_pred.forecast(year_to - 2015)
        gdp = self.gdp_pred.forecast(year_to - 2015)
        surface_temperature_change = self.contr_temp_rise_pred.forecast(year_to - 2015)
        data = []

        for i in range(start_data_index, end_data_index + 1):
            product = Input()
            product.year = 2015 + i - 55
            product.population = population[i]
            product.unemployment = unemployment[i]
            product.life_expectancy = life_expectancy[i]
            product.agriculture_orientation = agriculture_orientation[i]
            product.gini = gini[i]
            product.gdp = gdp[i]
            product.surface_temperature_change = surface_temperature_change[i]
            data.append(product)

        return data
