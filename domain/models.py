from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence

db = SQLAlchemy()


class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.BigInteger, Sequence('products_aid_seq', start=0, increment=1), primary_key=True)
    product_name = db.Column(db.String(100))

    def serialize(self):
        return {
            'product_id': self.product_id,
            'product_name': self.product_name,
        }


class ProductHistory(db.Model):
    __tablename__ = 'historical_data'
    data_id = db.Column(db.BigInteger, primary_key=True)
    food = db.Column(db.String(length=100))
    production = db.Column(db.String(length=100))
    import_quantity = db.Column(db.String(length=100))
    export_quantity = db.Column(db.String(length=100))
    product_id = db.Column(db.BigInteger(), db.ForeignKey("products.product_id"))
