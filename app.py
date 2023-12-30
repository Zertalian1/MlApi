from flask import Flask, jsonify
from flask import request
from domain.models import db, Product, ProductHistory
from models.ProductCountPredictModelService import ProductCountPredictModelService, ProductCountPredictInput

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://Zertallian:password@mlPostgres:5432/MlDb'
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
        products, error = parse_products(content_arr)
        if error is not None:
            return build_response(error, None, 400)

        predictions = []
        product_id = content_arr.get('product')
        first_pred_year = products[0].year
        product = Product.query.filter_by(product_id=product_id).first()

        for pr in ProductHistory.query.filter_by(product_id=product_id).order_by(ProductHistory.year):
            if pr.year == first_pred_year:
                break
            predictions.append(
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

        for pr in products:
            prediction = model.predict_results(pr)
            predictions.append(
                ProductResponse(
                    pr.year,
                    product.product_id,
                    product.product_name,
                    round(prediction['Food'][0].item(), 1),
                    round(prediction['Production'][0].item(), 1),
                    round(prediction['Import Quantity'][0].item(), 1),
                    round(prediction['Export Quantity'][0].item(), 1)
                )
            )

        return build_response(None, predictions, 200)
    if request.method == 'GET':
        return jsonify(products=[e.serialize() for e in Product.query.all()])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

with app.app_context():
    db.create_all()
