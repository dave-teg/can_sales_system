import { query } from "../../db/db.js";

export const getUserByUsernameService = async (username) => {
  const queryTxt = `SELECT * FROM users WHERE username = $1;`
  const values = [username]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const getUserByFullnameService = async (fullname) => {
  const queryTxt = `SELECT * FROM users WHERE fullname = $1;`
  const values = [fullname]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const createUserService = async (fullname, username, passwordHash, role= 'user') => {
  const queryTxt = `INSERT INTO users (fullname, username, password, role) VALUES ($1, $2, $3,$4) RETURNING id, username, fullname, role, created_at;`
  const values = [fullname, username, passwordHash, role]
  const result = await query(queryTxt, values);
  return result.rows[0]
}

export const getUserByIdService = async (id) => {
  const queryTxt = `SELECT id, username, role, created_at FROM users WHERE id = $1;`
  const values = [id]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

export const getAllUsersService = async () => {
  const queryTxt = `SELECT * FROM users ORDER BY created_at DESC;`;
  const result = await query(queryTxt)

  return result.rows
}

export const updateUserService = async (userId, fieldsToUpdate = {}) => {
  const { formattedFullname, hashedPassword, role, active} = fieldsToUpdate;


  //build the set clause dynamically
  const updates = []
  const values = []
  let index = 1;

  if(formattedFullname !== undefined){
    updates.push(`fullname = $${index++}`)
    values.push(formattedFullname)
  }

  if(hashedPassword !== undefined) {
    updates.push(`password = $${index++}`)
    values.push(hashedPassword)
  }

  if(role !== undefined) {
    updates.push(`role = $${index++}`)
    values.push(role)
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

  values.push(userId)

  const queryTxt = `
    UPDATE users SET ${updates?.join(', ')}
    WHERE id = $${index}
    RETURNING id, username, role, active;
  `

  // console.log(queryTxt)

  const result = await query(queryTxt, values)
  return result.rows[0]
}

//for later
export const updateCredentialsService = async () => {

}


export const deactivateUserService = async (id) => {
  const queryTxt = `UPDATE users SET active = false, deactivated_at = NOW() 
WHERE id = $1 RETURNING id, username, role, active;`
  const values = [id]
  const result = await query(queryTxt, values)
  return result.rows[0]
}

