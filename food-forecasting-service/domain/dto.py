class ProductResponseDto:
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

    def __iter__(self):
        return iter(
            [self.year, self.food_quantity, self.production_quantity, self.import_quantity, self.export_quantity]
        )
