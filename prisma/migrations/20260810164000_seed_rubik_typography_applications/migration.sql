INSERT INTO "TypographyApplication" (
  "id", "typographyId", "category", "weight", "sizePx", "lineHeight", "exampleText", "order", "createdAt", "updatedAt"
)
SELECT
  md5(t."id" || application.category),
  t."id",
  application.category,
  application.weight,
  application.size_px,
  application.line_height,
  application.example_text,
  application.display_order,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Typography" t
CROSS JOIN (
  VALUES
    ('Título', 'Semibold', 40, '1.2', 'A empresa que fica.', 0),
    ('Subtítulo', 'Medium', 24, '1.3', 'Para que o essencial nunca pare.', 1),
    ('Parágrafo', 'Regular', 16, '1.6', 'A Instalsat existe há quase três décadas para cuidar de uma camada da vida que ninguém percebe quando funciona, mas que paralisa o cotidiano quando falha.', 2),
    ('Destaque', 'Semibold', 20, '1.4', 'Presença contínua. Responsabilidade integral.', 3),
    ('Legenda', 'Light', 13, '1.5', 'Segurança eletrônica e manutenção elétrica. Desde 1998.', 4),
    ('Botão', 'Medium', 14, '1.0', 'Solicitar orçamento', 5)
) AS application(category, weight, size_px, line_height, example_text, display_order)
WHERE t."name" = 'Rubik'
  AND NOT EXISTS (
    SELECT 1
    FROM "TypographyApplication" existing
    WHERE existing."typographyId" = t."id"
      AND existing."category" = application.category
  );
