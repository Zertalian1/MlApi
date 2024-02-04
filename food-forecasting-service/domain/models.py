from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence, Column
import sqlalchemy as sa

db = SQLAlchemy()


class Product(db.Model):
    __tablename__ = 'products'
    product_id = Column(sa.BigInteger, Sequence('products_aid_seq', start=0, increment=1), primary_key=True)
    product_name = Column(db.String(100))

    def serialize(self):
        return {
            'product_id': self.product_id,
            'product_name': self.product_name,
        }


class ProductHistory(db.Model):
    __tablename__ = 'historical_data'
    data_id = Column(sa.BigInteger, primary_key=True)
    food = Column(sa.DECIMAL(10, 2))
    production = Column(sa.DECIMAL(10, 2))
    import_quantity = Column(sa.DECIMAL(10, 2))
    export_quantity = Column(sa.DECIMAL(10, 2))
    year = Column(sa.Integer)
    product_id = Column(sa.BigInteger(), sa.ForeignKey("products.product_id"))
