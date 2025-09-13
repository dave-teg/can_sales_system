import { query } from "../../db/db.js";

export const getCategoriesService = async () => {
  const queryTxt = `
  SELECT 
  c.id,
  c.name AS category_name,
  c.created_at,
  c.active,
  COUNT(p.id) AS product_count
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
  GROUP BY c.id, c.name
  ORDER BY c.name;`
  const result = await query(queryTxt)

  return result.rows
}

export const getCategoryByCategoryNameService = async (name) => {
  const queryTxt = `
  SELECT * FROM categories
  WHERE name = $1;    
  `
  const values = [name]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const createCategoryService = async (name) => {
  const queryTxt = `INSERT INTO categories (name) VALUES ($1) RETURNING *`
  const values = [name]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const updateCategoryService = async (id, fieldsToUpdate = {}) => {
  const { formattedName, active}  = fieldsToUpdate;

  //build the set clause dynamically
  const updates = []
  const values = []
  let index = 1;  

  if(formattedName !== undefined){
    updates.push(`name = $${index++}`)
    values.push(formattedName)
  }   

  if(active !== undefined) {
      updates.push(`active = $${index++}`)
      values.push(active);

    if(active === false) {
      updates.push(`deactivated_at = $${index++}`)
      values.push(new Date())
    } else if (active === true) {
      updates.push(`deactivated_at = NULL`)
    }
  }  

  const setClause = updates?.join(', ')
  const queryTxt = `UPDATE categories SET ${setClause} WHERE id = $${index} RETURNING *;`
  values.push(id)

  const result = await query(queryTxt, values)
  return result.rows[0];
}
