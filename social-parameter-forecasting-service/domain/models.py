from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column
import sqlalchemy as sa

db = SQLAlchemy()


class Input(db.Model):
    __tablename__ = 'inputs'
    data_id = Column(sa.BigInteger, primary_key=True)
    agriculture_orientation = Column(sa.DECIMAL(10, 2))
    surface_temperature_change = Column(sa.DECIMAL(10, 10))
    gdp = Column(sa.DECIMAL(10, 2))
    gini = Column(sa.DECIMAL(10, 10))
    life_expectancy = Column(sa.DECIMAL(10, 2))
    unemployment = Column(sa.DECIMAL(10, 2))
    population = Column(sa.BigInteger())
    year = Column(sa.Integer)

    def serialize(self):
        return {
            "year": self.year,
            "agriculture_orientation": self.agriculture_orientation,
            "surface_temperature_change": self.surface_temperature_change,
            "gdp": self.gdp,
            "gini": self.gini,
            "life_expectancy": self.life_expectancy,
            "unemployment": self.unemployment,
            "population": self.population
        }

    def __iter__(self):
        return iter(
            [
                self.year,
                self.agriculture_orientation,
                self.surface_temperature_change,
                self.gdp,
                self.gini,
                self.life_expectancy,
                self.unemployment,
                self.population
            ]
        )
