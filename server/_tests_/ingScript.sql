SELECT sort.*, CASE WHEN base_recipeID IS NULL THEN recipeID ELSE base_recipeID END AS recipeSortID
FROM (SELECT i.*
	FROM (SELECT hh.*, (CASE WHEN hh.base = 1 THEN CONCAT(ingredients.name," (",REPLACE(ROUND(amount_pc*100,2),".",","), "%): ") ELSE CONCAT(ingredients.name," (",REPLACE(ROUND(amount_pc*100,2),".",","), "%), ") END) AS name 
		FROM (SELECT c.*, "1" AS "level"
			FROM (SELECT b.recipeID, b.amount_pc AS total_amount_pc, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
				FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
					FROM dough
					WHERE 4 = recipeID) AS b   
			LEFT JOIN ingredients
			ON b.base_ingID = ingredients.ID) AS c
		UNION
		SELECT d.recipeID, d.total_amount_pc, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID, "2" AS "level"
			FROM (SELECT c.recipeID, (dough.amount_pc * c.amount_pc) AS total_amount_pc, dough.amount_pc AS amount_pc, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
				FROM (SELECT ingredients.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
					FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
						FROM dough
						WHERE 4 = recipeID ) AS b
					LEFT JOIN ingredients
					ON b.base_ingID = ingredients.ID) AS c
			LEFT JOIN dough
			ON c.base_recipeID = dough.recipeID) AS d
        LEFT JOIN ingredients
		ON d.base_ingID = ingredients.ID
		UNION
        SELECT f.recipeID, f.total_amount_pc, f.amount_pc, f.base_ingID, ingredients.recipeID AS base_recipeID, f.base, f.titleID, f.sortID,  "3" AS "level"
		FROM (SELECT e.recipeID, (dough.amount_pc * e.amount_pc) AS total_amount_pc, dough.amount_pc AS amount_pc, dough.ingredientID AS base_ingID, e.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
			FROM (SELECT ingredients.recipeID, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID
				FROM (SELECT c.recipeID, (dough.amount_pc* c.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
					FROM (SELECT b.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
						FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
							FROM dough
							WHERE 4 = recipeID) AS b
						LEFT JOIN ingredients
						ON b.base_ingID = ingredients.ID) AS c
				LEFT JOIN dough
				ON c.base_recipeID = dough.recipeID
				WHERE dough.base = 1) AS d
			LEFT JOIN ingredients
			ON d.base_ingID = ingredients.ID) AS e
		LEFT JOIN dough
		ON e.base_recipeID = dough.recipeID) AS f 
        LEFT JOIN ingredients
		ON f.base_ingID = ingredients.ID
		UNION
		SELECT h.recipeID, h.total_amount_pc, h.amount_pc, h.base_ingID, ingredients.recipeID AS base_recipeID, h.base, h.titleID, h.sortID,  "4" AS "level"
		FROM (SELECT  g.recipeID, (dough.amount_pc * g.amount_pc) AS total_amount_pc, dough.amount_pc, dough.ingredientID AS base_ingID, g.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
			FROM (SELECT  ingredients.recipeID, f.amount_pc, f.base_ingID, ingredients.recipeID AS base_recipeID, f.base, f.titleID, f.sortID
				FROM (SELECT e.recipeID, (dough.amount_pc* e.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, e.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID,  "3" AS "level"
					FROM (SELECT d.recipeID, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID
						FROM (SELECT c.recipeID, (dough.amount_pc* c.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
							FROM (SELECT b.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
								FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.recipeID AS base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
									FROM dough
									WHERE 4 = recipeID) AS b
                                LEFT JOIN ingredients
                                ON b.base_ingID = ingredients.ID) AS c
                            LEFT JOIN dough
                            ON c.base_recipeID = dough.recipeID
                            WHERE dough.base = 1) AS d
                        LEFT JOIN ingredients
                        ON d.base_ingID = ingredients.ID) AS e
                    LEFT JOIN dough
                    ON e.base_recipeID = dough.recipeID) AS f
                LEFT JOIN ingredients
                ON f.base_ingID = ingredients.ID) AS g
            LEFT JOIN dough
			ON g.base_recipeID = dough.recipeID) AS h
            LEFT JOIN ingredients
            ON h.base_ingID = ingredients.ID) AS hh
            LEFT JOIN ingredients
        	ON hh.base_ingID = ingredients.ID) AS i
  WHERE amount_pc > 0) AS sort
  ORDER BY recipeSortID ASC,  total_amount_pc DESC, level ASC