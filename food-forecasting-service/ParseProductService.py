from models.ProductPredictService import ProductCountPredictInput


class ParseProductService:

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
        return products, None
