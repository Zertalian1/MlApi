import math
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from domain.models import db, Product, ProductHistory
import configparser
import os
import io
import csv
from domain.dto import ProductResponseDto
from sqlalchemy import and_
from parser import ParseProductService
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


def collect_forecast(input_params, product, is_ignore_history):
    predictions = []
    if len(input_params) != 0:
        first_pred_year = input_params[0].year
    else:
        first_pred_year = 2021

    if is_ignore_history != 'true':
        for prod in ProductHistory.query.filter(
                and_(ProductHistory.product_id == product.product_id, ProductHistory.year < first_pred_year)
        ).order_by(ProductHistory.year):
            predictions.insert(
                prod.year - 1960,
                ProductResponseDto(
                    prod.year,
                    prod.product_id,
                    product.product_name,
                    float(prod.food),
                    float(prod.production),
                    float(prod.import_quantity),
                    float(prod.export_quantity)
                )
            )

    for prod in input_params:
        prediction = productPredictService.predict_results(prod)
        predictions.append(
            ProductResponseDto(
                prod.year,
                prod.product_id,
                product.product_name,
                round(math.exp(prediction['Food'][0].item()), 4),
                round(math.exp(prediction['Production'][0].item()), 4),
                round(math.exp(prediction['Import Quantity'][0].item()), 4),
                round(math.exp(prediction['Export Quantity'][0].item()), 4)
            )
        )
    return predictions


def to_csv(predictions):
    proxy = io.StringIO()
    writer = csv.writer(proxy)
    header = ["year", "food", "production", "import quantity", "export quantity"]
    writer.writerow(header)
    for pred in predictions:
        writer.writerow(list(pred))
    mem = io.BytesIO()
    mem.write(proxy.getvalue().encode())
    mem.seek(0)
    proxy.close()
    return mem


@app.route('/api/predict-food-balance', methods=['post', 'get'])
def predict_food_balance():
    if request.method == 'POST':
        if len(request.files) > 0:
            input_params, error, product_id = ParseProductService.parse_file(request.files or {})
        else:
            input_params, error, product_id = ParseProductService.parse_products(request.get_json() or {})
        if error is not None:
            return build_response(error, None, 400)
        product = Product.query.filter_by(product_id=product_id).first()
        predictions = collect_forecast(input_params, product, request.args.get('ignore_history'))
        if request.args.get('return_csv') == 'true':
            return send_file(
                to_csv(predictions),
                as_attachment=True,
                download_name=product.product_name + '.csv',
                mimetype='text/csv'
            )
        return build_response(None, predictions, 200)
    if request.method == 'GET':
        return jsonify(products=[e.serialize() for e in Product.query.all()])


if __name__ == '__main__':
    app.run(host='0.0.0.0')
