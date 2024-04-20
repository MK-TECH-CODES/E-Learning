// app.js
const postgres = require("postgres");
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
}

async function addUser(name, email, password, otp) {
  console.log(name, email, password, otp);
  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

    console.log("Length : ", existingUser.length);
    if (existingUser.length > 0) {
      return { message: "Appeared" };
    } else {
      const result = await sql`
      INSERT INTO users (name, email, password, otp) 
      VALUES (${name}, ${email}, ${password}, ${otp})
      RETURNING id, name, email;
    `;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function checkemail(email, otp) {
  try {
    const result =
      await sql`SELECT * FROM users WHERE email = ${email} AND otp = ${otp};`;
    console.log("OTP result length :", typeof result.length);
    if (result.length === 1) {
      return { success: true };
    } else {
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function logincheck(email, password) {
  try {
    const result =
      await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password};`;
    console.log("OTP result length :", result.length);
    if (result.length === 1) {
      const admin_mail = process.env.ADMIN_MAIL;
      const admin_pass = process.env.ADMIN_PASSWORD;
      console.log(typeof admin_mail, typeof admin_pass);
      if (email === admin_mail && password === admin_pass) {
        return { message: "admin" };
      } else {
        return { success: true };
      }
    } else {
      console.log("Invalid email or password.");
      return { success: false, message: "Invalid email or password." };
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function uploadcoursecard(title, author, description, link, course) {
  try {
    const last_id =
      await sql`SELECT course_id FROM coursecard ORDER BY course_id DESC LIMIT 1;`;
    const lastId = last_id[0].course_id + 1;
    const result = await sql`
      INSERT INTO coursecard (course_title, author_name, description, image_link, course_type, course_id)
      VALUES (${title}, ${author}, ${description}, ${link}, ${course}, ${lastId});
    `;
    // console.log(result);
    return { success: true };
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function totaldata() {
  try {
    const result = await sql`
      SELECT * FROM coursecard;
    `;
    // Corrected this line
    return result; // Also corrected here
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}
async function tablefind(tablename) {
  try {
    const result = await sql`
      SELECT * FROM ${sql(tablename)};
    `;
    // Corrected this line
    return result; // Also corrected here
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

async function uploadcourse(course_name, description) {
  console.log(course_name);
  console.log(description.length);

  try {
    const result1 = await sql`
    CREATE TABLE IF NOT EXISTS ${sql(course_name)} (
      id SERIAL PRIMARY KEY,
      SECTION VARCHAR(255) NOT NULL,
      DESCRIPTION VARCHAR(255) NOT NULL,
      LINKS VARCHAR(255) NOT NULL
    );
    `;
    for (let i = 0; i < description.length; i++) {
      const result2 = await sql`
      INSERT INTO ${sql(course_name)} (SECTION, DESCRIPTION, LINKS)
      VALUES (${`SECTION ${i + 1}`}, ${description[i].description}, ${
        description[i].url
      });
    
    `;
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message }; // Return the error message
  }
}

module.exports = {
  getPgVersion: getPgVersion,
  addUser: addUser,
  checkemail: checkemail,
  logincheck: logincheck,
  uploadcoursecard: uploadcoursecard,
  totaldata: totaldata,
  uploadcourse: uploadcourse,
  tablefind:tablefind
};
