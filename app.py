from flask import Flask, jsonify
from flask import request
from domain.models import db, Product
from models.ProductCountPredictModelService import ProductCountPredictModelService, ProductCountPredictInput

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://Zertallian:password@localhost:5433/MlDb'
app.config['SECRET_KEY'] = 'secret-key'
db.init_app(app)
model = ProductCountPredictModelService()


def parse_products(content_arr):
    if content_arr.get('product') is None:
        return None, "No product has been selected"
    product_id = content_arr.get('product')
    if product_id < 0 or product_id > 20:
        return None, "The selected product does not exist"
    products = []
    for content in content_arr.get("data"):
        product = ProductCountPredictInput.last_ear()
        if content.get('year') is None:
            return None, "Error during parsing Year"
        product.year = content.get('year', product.year)
        if content.get('population') is None:
            return None, "Error during parsing Population"
        product.population = content.get('population', product.population)
        if content.get('electricity') is None:
            return None, "Error during parsing Electricity"
        product.el_consumption = content.get('electricity', product.el_consumption)
        product.product_id = product_id
        products.append(product)
    return products, None


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
    def __init__(self, product_id, product_name, prediction):
        self.product_id = product_id
        self.product_name = product_name
        self.food_quantity = round(prediction['Food'][0].item(), 1)
        self.production_quantity = round(prediction['Production'][0].item(), 1)
        self.import_quantity = round(prediction['Import Quantity'][0].item(), 1)
        self.export_quantity = round(prediction['Export Quantity'][0].item(), 1)

    def serialize(self):
        return {
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
        products, error = parse_products(content_arr)
        if error is not None:
            return build_response(error, None, 400)

        predictions = []
        for product in products:
            prediction = model.predict_results(product)
            product = Product.query.filter_by(product_id=product.product_id).first()
            predictions.append(ProductResponse(product.product_id, product.product_name, prediction))

        return build_response(None, predictions, 200)
    if request.method == 'GET':
        return jsonify(products=[e.serialize() for e in Product.query.all()])


if __name__ == '__main__':
    app.run()

with app.app_context():
    db.create_all()