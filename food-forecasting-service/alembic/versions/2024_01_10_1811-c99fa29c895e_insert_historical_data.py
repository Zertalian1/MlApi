"""insert historical data

Revision ID: c99fa29c895e
Revises: d5acd49e3a28
Create Date: 2024-01-10 18:11:47.896402

"""
from _csv import reader
from typing import Sequence, Union

from alembic import op
import os
import sqlalchemy as sa
from domain.models import ProductHistory

# revision identifiers, used by Alembic.
revision: str = 'c99fa29c895e'
down_revision: Union[str, None] = 'd5acd49e3a28'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "historical_data",
        sa.Column("data_id", sa.BigInteger(), nullable=False),
        sa.Column("food", sa.DECIMAL(10, 2)),
        sa.Column("production", sa.DECIMAL(10, 2)),
        sa.Column("import_quantity", sa.DECIMAL(10, 2)),
        sa.Column("export_quantity", sa.DECIMAL(10, 2)),
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
