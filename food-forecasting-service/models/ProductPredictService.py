import joblib
import pandas as pd


class ProductCountPredictInput:

    def __init__(self):
        self.product_id = 0
        self.year = 2020
        self.population = 145617329
        self.agriculture_orientation = 1.69
        self.surface_temperature_change = 0.09708758
        self.gdp = 26583.797
        self.gini = 0.406443
        self.life_expectancy = 72.0
        self.unemployment = 5.59


class ProductPredictService:
    def __init__(self):
        self.model = joblib.load('./models/test.joblib')
        self.scaler = joblib.load('./models/scaler.save')

    def predict_results(self, product_input):
        data = {
            'Id': [product_input.product_id],
            'Year': [product_input.year],
            'Agriculture Orientation': [product_input.agriculture_orientation],
            'Surface temperature Change': [product_input.surface_temperature_change],
            'GDP': [product_input.gdp],
            'Gini': [product_input.gini],
            'Life Expectancy': [product_input.life_expectancy],
            'Population': [product_input.population],
            'Unemployment': [product_input.unemployment]
        }
        data = pd.DataFrame(data=self.scaler.transform(pd.DataFrame(data)))
        pred = self.model.predict(data)
        return pd.DataFrame(pred, columns=["Food", "Production", "Import Quantity", "Export Quantity"])
