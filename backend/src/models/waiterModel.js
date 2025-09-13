import { query } from "../../db/db.js";

export const getAllWaitersService = async () => {
  const queryTxt = `SELECT * FROM waiters ORDER BY created_at DESC;`;
  const result = await query(queryTxt)

  return result.rows
}

//get waiter by name
export const getWaiterByNameService = async (fullname) => { 
  const queryTxt = `SELECT * FROM waiters WHERE fullname = $1;`
  const values = [fullname]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const createWaiterService = async (fullname) => {
  const queryTxt = `INSERT INTO waiters (fullname) VALUES ($1) RETURNING *;`
  const values = [fullname]
  const result = await query(queryTxt, values);
  return result.rows[0]
}

export const getWaiterByIdService = async (id) => {
  const queryTxt = `SELECT * FROM waiters WHERE id = $1;`
  const values = [id]
  const result = await query(queryTxt, values)
  return result.rows[0]
}       

export const updateWaiterService = async (waiterId, fieldsToUpdate = {}) => {
  const { formattedFullname, active} = fieldsToUpdate;
    
  //build the set clause dynamically  
    const updates = []
    const values = []
    let index = 1;
    
    if(formattedFullname !== undefined){
      updates.push(`fullname = $${index++}`)
      values.push(formattedFullname)
    }   
    if(active !== undefined) {
        updates.push(`active = $${index++}`)
        values.push(active) 

        if(active === false){
          updates.push(`deactivated_at = $${index++}`)
          values.push(new Date())
        } else if (active === true){
          updates.push(`deactivated_at = NULL`)
        }
    }  
    
    
    const setClause = updates?.join(', ')
    const queryTxt = `UPDATE waiters SET ${setClause} WHERE id = $${index} RETURNING *;`
    values.push(waiterId)
    
    const result = await query(queryTxt, values)
    return result.rows[0]   
}

export const deactivateWaiterService = async (id) => {
  const queryTxt = `UPDATE waiters SET active = false, deactivated_at = NOW() 
WHERE id = $1 RETURNING *;`
  const values = [id]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

