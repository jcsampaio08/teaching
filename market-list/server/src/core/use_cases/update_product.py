from typing import Optional

from src.core.entities.product import Product
from src.core.exceptions import ProductNotFound
from src.core.interfaces.product_repository import ProductRepository
from src.core.interfaces.usecase_interface import UseCase

class UpdateProductUseCase(UseCase):
    """Use case to update an existing product identified by its old name."""

    def __init__(self, repository: ProductRepository):
      self._repository = repository
    
    def execute(self, nome_antigo: str, nome: str, quantidade: Optional[int], valor: Optional[float]) -> Product:
      produto = Product(nome=nome, quantidade=quantidade, valor=valor)
      updated = self._repository.update_by_name(nome_antigo, produto)
      if not updated:
          raise ProductNotFound(f"Produto '{nome_antigo}' não foi encontrado.")
      return updated