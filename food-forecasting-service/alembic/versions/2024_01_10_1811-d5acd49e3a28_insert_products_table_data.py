"""insert products table data

Revision ID: d5acd49e3a28
Revises: 18785015759c
Create Date: 2024-01-10 18:11:34.507560

"""
from typing import Sequence, Union

from alembic import op

from domain.models import Product

# revision identifiers, used by Alembic.
revision: str = 'd5acd49e3a28'
down_revision: Union[str, None] = '18785015759c'
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
                "product_name": "Молоко"
            },
            {
                "product_id": 8,
                "product_name": "Орехи"
            },
            {
                "product_id": 9,
                "product_name": "Масло и животный жир"
            },
            {
                "product_id": 10,
                "product_name": "Горох"
            },
            {
                "product_id": 11,
                "product_name": "Свинина"
            },
            {
                "product_id": 12,
                "product_name": "Картофель"
            },
            {
                "product_id": 13,
                "product_name": "Мясо птицы"
            },
            {
                "product_id": 14,
                "product_name": "Рис"
            },
            {
                "product_id": 15,
                "product_name": "Рожь"
            },
            {
                "product_id": 16,
                "product_name": "Сахар"
            },
            {
                "product_id": 17,
                "product_name": "Чай"
            },
            {
                "product_id": 18,
                "product_name": "Овощи"
            },
            {
                "product_id": 19,
                "product_name": "Пшеница"
            },
        ],
    )


def downgrade() -> None:
    pass
