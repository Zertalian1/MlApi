from models.ProductPredictService import ProductCountPredictInput
import pandas as pd
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'csv'}


class ParseProductService:
    # брать файл от юзера?
    @staticmethod
    def parse_file(files):
        if 'file' not in files:
            return None, "file must have key 'file'"
        data = pd.read_csv(files.get('file'), header=None)
        products = []
        product_id = data[0][0]
        for j in range(0, len(data[0])):
            product = ProductCountPredictInput()
            product.product_id = data[0][j]
            product.year = data[1][j]
            product.population = data[2][j]
            product.life_expectancy = data[3][j]
            product.gini = data[4][j]
            product.gdp = data[5][j]
            product.surface_temperature_change = data[6][j]
            product.agriculture_orientation = data[7][j]
            product.unemployment = data[8][j]
            products.append(product)
        return products, None, product_id

    @staticmethod
    def parse_products(content_arr):
        if content_arr.get('product') is None:
            return None, "No product has been selected"
        product_id = content_arr.get('product')
        if product_id < 0 or product_id > 20:
            return None, "The selected product does not exist"
        products = []
        for content in content_arr.get("data"):
            product = ProductCountPredictInput()
            if content.get('year') is None:
                return None, "Error during parsing Year"
            product.year = content.get('year', product.year)
            if content.get('population') is None:
                return None, "Error during parsing Population"
            product.population = content.get('population', product.population)
            if content.get('life_expectancy') is None:
                return None, "Error during parsing Life Expectancy"
            product.life_expectancy = content.get('life_expectancy', product.life_expectancy)
            if content.get('gini') is None:
                return None, "Error during parsing Gini"
            product.gini = content.get('gini', product.gini)
            if content.get('gdp') is None:
                return None, "Error during parsing GDP"
            product.gdp = content.get('gdp', product.gdp)
            if content.get('surface_temperature_change') is None:
                return None, "Error during parsing Surface temperature change"
            product.surface_temperature_change = content.get(
                'surface_temperature_change',
                product.surface_temperature_change
            )
            if content.get('agriculture_orientation') is None:
                return None, "Error during parsing Agriculture orientation"
            product.agriculture_orientation = content.get('agriculture_orientation', product.agriculture_orientation)
            if content.get('unemployment') is None:
                return None, "Error during parsing Unemployment"
            product.unemployment = content.get('unemployment', product.unemployment)
            product.product_id = product_id
            products.append(product)
        return products, None, product_id
