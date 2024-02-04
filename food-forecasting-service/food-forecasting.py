import math
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, request, jsonify
from flask_cors import CORS
from domain.models import db, Product, ProductHistory
import configparser
import os
from time import perf_counter
from sqlalchemy import and_
from ParseProductService import ParseProductService
from models.ProductPredictService import ProductPredictService

config = configparser.ConfigParser()
config.read("./config/config-" + os.environ.get('FLASK_ENV') + ".ini")
print(os.environ.get('FLASK_ENV'))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://' + config["Database"]["username"] + ':' + \
                                        config["Database"]["password"] + '@' + config["Database"]["host"] + ':' + \
                                        config["Database"]["port"] + '/' + config["Database"]["name"]
app.config['SECRET_KEY'] = 'secret-key'
db.init_app(app)
CORS(app)

productPredictService = ProductPredictService()


def build_response(message, data, status_code=200):
    data_parse = []
    if data is not None:
        for element in data:
            data_parse.append(element.serialize())
    return jsonify(
        {
            "message": message,
            "data": data_parse
        }
    ), status_code


class ProductResponse:
    def __init__(
            self,
            year: int,
            product_id: int,
            product_name: str,
            food_quantity: float,
            production_quantity: float,
            import_quantity: float,
            export_quantity: float
    ):
        self.year = year
        self.product_id = product_id
        self.product_name = product_name
        self.food_quantity = food_quantity
        self.production_quantity = production_quantity
        self.import_quantity = import_quantity
        self.export_quantity = export_quantity

    def serialize(self):
        return {
            "year": self.year,
            "product_id": self.product_id,
            "product_name": self.product_name,
            "food_quantity": self.food_quantity,
            "production_quantity": self.production_quantity,
            "import_quantity": self.import_quantity,
            "export_quantity": self.export_quantity
        }


@app.route('/api/predict-food-balance', methods=['post', 'get'])
def predict_food_balance():
    if request.method == 'POST':
        content_arr = request.get_json() or {}
        products, error = ParseProductService.parse_products(content_arr)
        if error is not None:
            return build_response(error, None, 400)

        predictions = []
        product_id = content_arr.get('product')
        first_pred_year = products[0].year
        product = Product.query.filter_by(product_id=product_id).first()

        with ThreadPoolExecutor() as executor:
            for pr in ProductHistory.query.filter(
                    and_(ProductHistory.product_id == product_id, ProductHistory.year < first_pred_year)
            ).order_by(ProductHistory.year):
                predictions.insert(
                    pr.year - 1960,
                    ProductResponse(
                        pr.year,
                        product.product_id,
                        product.product_name,
                        float(pr.food),
                        float(pr.production),
                        float(pr.import_quantity),
                        float(pr.export_quantity)
                    )
                )

        start = perf_counter()
        for pr in products:
            prediction = productPredictService.predict_results(pr)
            predictions.append(
                ProductResponse(
                    pr.year,
                    product.product_id,
                    product.product_name,
                    round(math.exp(prediction['Food'][0].item()), 4),
                    round(math.exp(prediction['Production'][0].item()), 4),
                    round(math.exp(prediction['Import Quantity'][0].item()), 4),
                    round(math.exp(prediction['Export Quantity'][0].item()), 4)
                )
            )
        finish = perf_counter()
        print(f"Выполнение заняло {finish - start} секунд.")
        return build_response(None, predictions, 200)
    if request.method == 'GET':
        return jsonify(products=[e.serialize() for e in Product.query.all()])


if __name__ == '__main__':
    app.run(host='0.0.0.0')
