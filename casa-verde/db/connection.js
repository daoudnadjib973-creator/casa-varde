'use strict';

/**
 * db/connection.js
 * Opens (or creates) the SQLite database file and applies
 * the recommended pragmas for a single-server web application.
 *
 * The parent directory of DB_PATH is created automatically if it does
 * not exist. This is required on platforms like Render where a fresh
 * deploy or a custom persistent-volume path may not have the directory
 * pre-created.
 *
 * Exported as a singleton: every module that requires this file
 * receives the same open Database instance.
 */

const path     = require('path');
const fs       = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, 'casa_verde.db');

/* Ensure the directory that will hold the database file exists.
   recursive: true is a no-op when the directory already exists. */
const DB_DIR = path.dirname(DB_PATH);
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH, {
  // Log SQLite internals only when DEBUG_DB is set (never in production)
  verbose: process.env.DEBUG_DB ? console.log : null,
});

/*
 * WAL mode: writers do not block readers. Correct for a web server where
 * reads (menu fetches) are far more frequent than writes (order submissions).
 */
db.pragma('journal_mode = WAL');

/*
 * Foreign key enforcement is OFF by default in SQLite — turn it on so that
 * order_items.order_id -> orders.id and order_items.product_id -> products.id
 * are actually checked at insert time.
 */
db.pragma('foreign_keys = ON');

/*
 * Increase the page cache to ~8 MB. For a small restaurant database this
 * keeps the entire dataset in memory after the first read.
 */
db.pragma('cache_size = -8000'); // negative = kilobytes

/*
 * Synchronous = NORMAL: flush to OS on every WAL checkpoint rather than
 * on every individual write. Safe against OS crashes; acceptable risk for
 * this use-case (a single restaurant, not a bank).
 */
db.pragma('synchronous = NORMAL');

module.exports = db;

/*
 * WAL mode: writers do not block readers. Correct for a web server where
 * reads (menu fetches) are far more frequent than writes (order submissions).
 */
db.pragma('journal_mode = WAL');

/*
 * Foreign key enforcement is OFF by default in SQLite — turn it on so that
 * order_items.order_id -> orders.id and order_items.product_id -> products.id
 * are actually checked at insert time.
 */
db.pragma('foreign_keys = ON');

/*
 * Increase the page cache to ~8 MB. For a small restaurant database this
 * keeps the entire dataset in memory after the first read.
 */
db.pragma('cache_size = -8000'); // negative = kilobytes

/*
 * Synchronous = NORMAL: flush to OS on every WAL checkpoint rather than
 * on every individual write. Safe against OS crashes; acceptable risk for
 * this use-case (a single restaurant, not a bank).
 */
db.pragma('synchronous = NORMAL');

module.exports = db;
