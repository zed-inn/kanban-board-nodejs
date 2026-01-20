import db from "@config/db";

const alterUserFixEmailPassword = async () => {
  const alterUserSql = `
ALTER TABLE users
ALTER COLUMN email TYPE VARCHAR(255),
ALTER COLUMN password_hash TYPE VARCHAR(255);
    `;
  await db.query(alterUserSql);
};

const alterUserFixTimestamps = async () => {
  const alterUserSql = `
ALTER TABLE users RENAME COLUMN createdat TO created_at;
ALTER TABLE users RENAME COLUMN updatedat TO updated_at;
  `;
  await db.query(alterUserSql);
};

const run = async () => {
  // await alterUserFixTimestamps();
  await db.close();
};

run();
