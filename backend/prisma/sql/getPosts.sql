-- @param {Int} $1:lastId
-- @param {Int} $2:take

SELECT 
    p.id AS "ID do post",
    p.title AS "Título", 
    p.content AS "Conteúdo",
    p.published AS "Publicado?", 
    u.id AS "ID do autor", 
    u.email AS "E-mail do autor",
    u.name AS "Nome do autor"
FROM 
    "Post" p
JOIN 
    "User" u ON p."authorId" = u.id
WHERE 
    p.id > $1
ORDER BY 
    p.id DESC
LIMIT $2;