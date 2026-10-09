# Diretrizes de Preços, Lojas e Links (Hardware Brasil)

Sempre que realizar consultas, cotações, geração de links ou buscas de peças de computador:

1. **Lojas Brasileiras de Informática**:
   - Consultar exclusivamente lojas consolidadas no Brasil (ex: KaBuM!, TerabyteShop, Pichau, Mercado Livre, Amazon Brasil).
2. **Discriminação Clara de Valores**:
   - Indicar claramente e de forma separada:
     - **"À vista no PIX"** (valor com desconto à vista / boleto).
     - **"A prazo/cartão"** (valor parcelado em até 10x ou 12x).
3. **Links Reais e Canônicos**:
   - Utilizar sempre URLs diretas e reais obtidas na pesquisa.
   - Nunca inventar, adivinhar ou gerar links fictícios.
4. **Padrão de Busca Direta por Loja (Fallback Oficial)**:
   - Caso não encontre a URL exata da página do produto específico, utilizar obrigatoriamente os padrões oficiais de busca:
     - **KaBuM!**: `https://www.kabum.com.br/busca/{termo_de_busca}` (ou `?query={termo}`)
     - **TerabyteShop**: `https://www.terabyteshop.com.br/busca?str={termo_de_busca}`
     - **Pichau**: `https://www.pichau.com.br/search?q={termo_de_busca}`
     - **Mercado Livre**: `https://lista.mercadolivre.com.br/{termo_de_busca}`
     - **Google Shopping**: `https://www.google.com.br/search?tbm=shop&q={termo_de_busca}`

# Diretrizes para Comparador de Preços (Comercial e Técnico)

Ao desenvolver ou expandir o comparador de preços, siga as práticas recomendadas abaixo:

1. **Arquitetura e Captura de Dados**:
   - **APIs Oficiais e Feeds XML (Prioridade)**: Utilize integrações via redes de afiliados ou feeds das lojas para garantir dados estruturados e links monetizáveis.
   - **Web Scraping (Alternativa/Fallback)**: Empregar scraping apenas como alternativa técnica (ex: Node.js) ciente do custo de manutenção frequente devido a mudanças de layout nas lojas originais.
2. **Modelagem e Normalização**:
   - Use identificadores únicos globais (**EAN/GTIN**) ou **Part Numbers** dos fabricantes (ex: `100-100000927BOX` para o Ryzen 5 5600) para cruzar com precisão produtos entre a KaBuM!, Pichau, etc.
   - Empregue lógicas de Match ou NLP para padronizar títulos divergentes entre e-commerces.
3. **Monetização**:
   - Implemente rastreamento e tags utilizando redes como Lomadee, Awin ou Rakuten para geração de receita por afiliação.
   - Considere no futuro métricas baseadas em **Custo por Clique (CPC)** para as plataformas de hardware.
4. **Stack Tecnológico Recomendado (MVP)**:
   - **Captura**: Node.js / Python
   - **Banco de Dados**: PostgreSQL (ou Elasticsearch para busca rápida do catálogo)
   - **Interface**: React, Next.js ou WordPress (já estamos utilizando React/Node)
