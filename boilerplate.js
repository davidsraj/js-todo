class DB {
  db = null;
  config = {
    locateFile: (filename) =>
      "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm",
  };
  constructor() {
    this.getLocalStorageData();
  }

  getLocalStorageData() {
    initSqlJs(this.config).then((SQL) => {
      localforage
        .getItem("db")
        .then((value) => {
          this.#initDB(value, SQL);
        })
        .catch(function (err) {
          console.log("Error: " + err);
        });
    });
  }

  #initDB(value, SQL) {
    if (value) {
      // if db exists, load it
      this.db = new SQL.Database(value);
    } else {
      // if db doesn't exist, create it
      console.log("Creating db");
      this.db = new SQL.Database();
      // Run a query without reading the results
      this.db.run(this.createQuery);
    }
    window.db = this.db;
    renderTable();
  }

  #storeIndexDB() {
    localforage.setItem("db", this.db.export()).catch(function (err) {
      if (err) console.log(err);
    });
  }

  insert(insertQuery, values) {
    this.db.run(insertQuery, values);
    this.#storeIndexDB();
  }

  update(updateQuery, values) {
    this.#storeIndexDB();
  }

  delete(deleteQuery, values) {
    this.db.run(deleteQuery, values);
    this.#storeIndexDB();
  }

  select(selectQuery) {
    return this.db.exec("SELECT * FROM todo");
  }

  UpdateRow(query, id) {
    this.db.run(query, [id]);
    this.#storeIndexDB();
  }
}

const database = new DB();
