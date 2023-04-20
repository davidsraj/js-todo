class Todo {
  config = {
    locateFile: (filename) =>
      "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm",
  };
  db;
  insertQuery = "INSERT INTO todo VALUES (?, ?, ?)";
  deleteQuery = "DELETE FROM todo WHERE todo_id = ?";
  selectQuery = "SELECT * FROM todo";
  createQuery =
    "CREATE TABLE todo (todo_id INTEGER PRIMARY KEY, todo TEXT NOT NULL, state TEXT NOT NULL)";

  constructor() {
    this.getLocalStorageData();
  }

  getLocalStorageData() {
    initSqlJs(this.config).then((SQL) => {
      localforage
        .getItem("db")
        .then((value) => {
          this.initDB(value, SQL);
        })
        .catch(function (err) {
          console.log("Error: " + err);
        });
    });
  }

  initDB(value, SQL) {
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
    this.renderTableData();
  }

  renderTableData() {
    // execute select

    const result = this.db.exec(this.selectQuery);
    // construct table
    // base case - no data
    console.log(result, "result");
    if (result.length === 0) {
      document.getElementById("sql-result").innerHTML = "";
      return;
    }

    // construct the header
    let headerString = "";
    result[0].columns.forEach((column) => {
      headerString += `<th>${column}</th>`;
    });
    headerString += `<th>Actions</th>`;
    headerString = `<tr>${headerString}</tr>`;

    var rows = "";
    result[0].values.forEach((row) => {
      var rowString = "";
      row.forEach((column) => {
        rowString += `<td>${column}</td>`;
      });
      rowString += `<td><button class="btn btn-primary" onclick="deleteTODO(${row[0]})">Delete</button></td>`;

      rowString = `<tr>${rowString}</tr>`;
      rows += rowString;
    });

    let tableString = `<table>${headerString}${rows}</table>`;
    document.getElementById("sql-result").innerHTML = tableString;
    console.log("successfullyrendered");
  }

  renderTable() {
    localforage.setItem("db", this.db.export()).catch(function (err) {
      if (err) console.log(err);
    });

    this.renderTableData();
  }

  insertTODO() {
    var text = document.getElementById("myInput").value;
    this.db.run(this.insertQuery, [null, text, "Done"]);
    console.log(this.db, "jjhj");
    // Boilerplate: render the table
    this.renderTable();
  }

  deleteTODO(todoID) {
    this.db.run(this.deleteQuery, [todoID]);
    this.renderTable();
  }
}

const todo = new Todo();
