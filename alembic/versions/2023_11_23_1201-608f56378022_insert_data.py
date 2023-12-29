"""Insert data

Revision ID: 608f56378022
Revises: 9dad894bd08c
Create Date: 2023-11-23 12:01:12.825554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import table, column

from domain.models import Product

# revision identifiers, used by Alembic.
revision: str = '608f56378022'
down_revision: Union[str, None] = '9dad894bd08c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.bulk_insert(
        Product.__table__,
        [
            {
                "product_id": 0,
                "product_name": "Алкогольные напитки"
            },
            {
                "product_id": 1,
                "product_name": "Ячмень"
            },
            {
                "product_id": 2,
                "product_name": "Мясо крупного рогатого скота"
            },
            {
                "product_id": 3,
                "product_name": "Злаки - за исключением пива"
            },
            {
                "product_id": 4,
                "product_name": "Яйца"
            },
            {
                "product_id": 5,
                "product_name": "Рыба и морепродукты"
            },
            {
                "product_id": 6,
                "product_name": "Фрукты"
            },
            {
                "product_id": 7,
                "product_name": "Мясо"
            },
            {
                "product_id": 8,
                "product_name": "Молоко"
            },
            {
                "product_id": 9,
                "product_name": "Орехи"
            },
            {
                "product_id": 10,
                "product_name": "Масло и животный жир"
            },
            {
                "product_id": 11,
                "product_name": "Горох"
            },
            {
                "product_id": 12,
                "product_name": "Свинина"
            },
            {
                "product_id": 13,
                "product_name": "Картофель"
            },
            {
                "product_id": 14,
                "product_name": "Мясо птицы"
            },
            {
                "product_id": 15,
                "product_name": "Рис"
            },
            {
                "product_id": 16,
                "product_name": "Рожь"
            },
            {
                "product_id": 17,
                "product_name": "Сахар"
            },
            {
                "product_id": 18,
                "product_name": "Чай"
            },
            {
                "product_id": 19,
                "product_name": "Овощи"
            },
            {
                "product_id": 20,
                "product_name": "Пшеница"
            },
        ],
    )


def downgrade() -> None:
    pass
