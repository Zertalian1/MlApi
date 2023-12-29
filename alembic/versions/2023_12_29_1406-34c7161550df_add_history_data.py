"""add history data

Revision ID: 34c7161550df
Revises: 608f56378022
Create Date: 2023-12-29 14:06:30.749001

"""
from _csv import reader
from pathlib import Path
from typing import Sequence, Union

from alembic import op
import os
import sqlalchemy as sa

from domain.models import ProductHistory

# revision identifiers, used by Alembic.
revision: str = '34c7161550df'
down_revision: Union[str, None] = '608f56378022'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "historical_data",
        sa.Column("data_id", sa.BigInteger(), nullable=False),
        sa.Column("food", sa.String(length=100)),
        sa.Column("production", sa.String(length=100)),
        sa.Column("import_quantity", sa.String(length=100)),
        sa.Column("export_quantity", sa.String(length=100)),
        sa.Column("product_id", sa.BigInteger()),
        sa.Column("year", sa.Integer()),
        sa.ForeignKeyConstraint(("product_id",), ["products.product_id"], )
    )

    dir_name = os.path.dirname(__file__)
    file_name = os.path.join(dir_name, 'historical_data.csv')
    lines = list(reader(open(file_name, 'r')))
    headers = lines.pop(0)

    data = [dict(zip(headers, line)) for line in lines]

    op.bulk_insert(ProductHistory.__table__, data)


def downgrade() -> None:
    op.drop_table('historical_data')
