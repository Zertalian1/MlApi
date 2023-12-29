import numpy as np

import pandas as pd
import tensorflow as tf
import joblib


class ProductCountPredictInput:

    def __init__(self, product_id: int, year: int, population: int, el_consumption: float):
        self.product_id = product_id
        self.year = year
        self.population = population
        self.el_consumption = el_consumption

    @classmethod
    def last_ear(cls):
        return cls(0, 2020, 148725601, 14904.3)


class ProductCountPredictModelService:
    def __init__(self):
        self.model = tf.keras.models.load_model('./models/resources/maml')
        self.scaler = joblib.load('./models/resources/scaler.save')

    def predict_results(self, product_input):
        data = {'Year': [product_input.year],
                'Id': [product_input.product_id],
                'Peoples': [product_input.population],
                'Electricity': [product_input.el_consumption]}
        data = pd.DataFrame(data=self.scaler.transform(pd.DataFrame(data)))
        pred = self.model.predict(data)
        return pd.DataFrame(pred, columns=["Food", "Production", "Import Quantity", "Export Quantity"])
