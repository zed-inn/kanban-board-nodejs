"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`
    ALTER TABLE boards
    ALTER COLUMN user_id SET NOT NULL;

    ALTER TABLE boards
    DROP CONSTRAINT boards_user_id_fkey;

    ALTER TABLE boards
    ADD CONSTRAINT boards_user_id_fkey
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    ALTER TABLE boards
    ALTER COLUMN user_id DROP NOT NULL;

    ALTER TABLE boards
    DROP CONSTRAINT boards_user_id_fkey;

    ALTER TABLE boards
    ADD CONSTRAINT boards_user_id_fkey
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL;
  `);
};

exports._meta = {
  version: 1,
};
