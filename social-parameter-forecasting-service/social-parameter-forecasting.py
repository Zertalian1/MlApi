from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sqlalchemy import and_
import io
import csv
from domain.models import Input, db
import configparser
from models.DataPredictService import DataPredictService
import os

config = configparser.ConfigParser()
config.read("./config/config-" + os.environ.get('FLASK_ENV') + ".ini")
print(config["Database"]["username"])
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://' + config["Database"]["username"] + ':' + \
                                        config["Database"]["password"] + '@' + config["Database"]["host"] + ':' + \
                                        config["Database"]["port"] + '/' + config["Database"]["name"]
app.config['SECRET_KEY'] = 'secret-key'
db.init_app(app)
CORS(app)
dataPredictService = DataPredictService()


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


def to_csv(data):
    proxy = io.StringIO()
    writer = csv.writer(proxy)
    header = [
        "year",
        "agriculture orientation",
        "surface temperature change",
        "gdp",
        "gini",
        "life expectancy",
        "unemployment",
        "population"
    ]
    writer.writerow(header)
    for pred in data:
        writer.writerow(list(pred))
    mem = io.BytesIO()
    mem.write(proxy.getvalue().encode())
    mem.seek(0)
    proxy.close()
    return mem


@app.route('/api/predict-input-data', methods=['post'])
def predict_input_data():
    if request.method == 'POST':
        is_range = request.args.get('range')
        content = request.get_json() or {}
        if is_range == "true":
            if content.get('year_from') is None:
                return build_response("Error during parsing start Year", None, 400)
            year_from = int(content.get('year_from'))
            if content.get('year_to') is None:
                return build_response("Error during parsing end Year", None, 400)
            year_to = int(content.get('year_to'))
            if year_to < year_from or year_from < 1960:
                return build_response("Error during parsing Year", None, 400)
            data = []
            data += Input.query.filter(
                and_(Input.year >= year_from, Input.year <= year_to)
            ).order_by(Input.year)
            if year_to > 2020:
                if year_from > 2020:
                    data += dataPredictService.predict_input_interval(year_from, year_to)
                else:
                    data += dataPredictService.predict_input_interval(2021, year_to)
        else:
            if content.get('year') is None:
                return build_response("Error during parsing Year", None, 400)
            year = content.get('year')
            if year > 2020:
                data = [dataPredictService.predict_input(year)]
            else:
                data = [Input.query.filter_by(year=year).first()]
        if request.args.get('return_csv') == 'true':
            return send_file(
                to_csv(data),
                as_attachment=True,
                download_name='input_data_predictions.csv',
                mimetype='text/csv'
            )
        return build_response(None, data, 200)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
