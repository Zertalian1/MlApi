import joblib
import pandas as pd
import os


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
        models_files = [f.name for f in os.scandir('./models/models') if f.is_file()]
        models_files.sort()
        scalers_files = [f.name for f in os.scandir('./models/scalers') if f.is_file()]
        scalers_files.sort()
        self.model = []
        self.scaler = []
        for i in range(0, len(models_files)):
            id = int(models_files[i][5: models_files[i].find(".", 6)])
            self.model.insert(id, joblib.load('./models/models/' + models_files[i]))
            self.scaler.insert(id, joblib.load('./models/scalers/' + scalers_files[i]))

    def predict_results(self, product_input):
        data = {
            #'Year': [product_input.year],
            'Agriculture Orientation': [product_input.agriculture_orientation],
            'Surface temperature Change': [product_input.surface_temperature_change],
            'GDP': [product_input.gdp],
            'Gini': [product_input.gini],
            'Life Expectancy': [product_input.life_expectancy],
            'Population': [product_input.population],
            'Unemployment': [product_input.unemployment]
        }
        data = pd.DataFrame(data=self.scaler[product_input.product_id].transform(pd.DataFrame(data)))
        pred = self.model[product_input.product_id].predict(data)
        return pd.DataFrame(pred, columns=["Food", "Production", "Import Quantity", "Export Quantity"])
