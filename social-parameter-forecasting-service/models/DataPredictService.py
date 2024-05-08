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
        product.population = round(self.population_pred.forecast(year - 2015)[last_data_index], 0)
        product.unemployment = round(self.unemployment_rate_pred.forecast(year - 2015)[last_data_index], 2)
        product.life_expectancy = round(self.life_expectancy_pred.forecast(year - 2015)[last_data_index], 2)
        product.agriculture_orientation = round(self.government_agr_or_pred.forecast(year - 2015)[last_data_index], 2)
        product.gini = round(self.gini_coef_pred.forecast(year - 2015)[last_data_index], 2)
        product.gdp = round(self.gdp_pred.forecast(year - 2015)[last_data_index], 2)
        product.surface_temperature_change = round(self.contr_temp_rise_pred.forecast(year - 2015)[last_data_index], 2)
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
            product.population = round(population[i], 0)
            product.unemployment = round(unemployment[i], 2)
            product.life_expectancy = round(life_expectancy[i], 2)
            product.agriculture_orientation = round(agriculture_orientation[i], 2)
            product.gini = round(gini[i], 2)
            product.gdp = round(gdp[i], 2)
            product.surface_temperature_change = round(surface_temperature_change[i], 2)
            data.append(product)

        return data
