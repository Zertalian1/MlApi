"""add input table

Revision ID: c5d770347f05
Revises: 
Create Date: 2024-01-10 14:07:24.894359

"""
from typing import Sequence, Union
from _csv import reader
from alembic import op
import sqlalchemy as sa
import os

from domain.models import Input


# revision identifiers, used by Alembic.
revision: str = 'c5d770347f05'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "inputs",
        sa.Column("data_id", sa.BigInteger(), nullable=False),
        sa.Column("agriculture_orientation", sa.DECIMAL(10, 2)),
        sa.Column("surface_temperature_change", sa.DECIMAL(10, 10)),
        sa.Column("gdp", sa.DECIMAL(10, 2)),
        sa.Column("gini", sa.DECIMAL(10, 10)),
        sa.Column("life_expectancy", sa.DECIMAL(10, 2)),
        sa.Column("unemployment", sa.DECIMAL(10, 2)),
        sa.Column("population", sa.BigInteger()),
        sa.Column("year", sa.Integer())
    )
    dir_name = os.path.dirname(__file__)
    file_name = os.path.join(dir_name, 'input_data.csv')
    lines = list(reader(open(file_name, 'r')))
    headers = lines.pop(0)

    data = [dict(zip(headers, line)) for line in lines]

    op.bulk_insert(Input.__table__, data)


def downgrade() -> None:
    pass
