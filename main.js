// initialize the DB
const createQuery =
  "CREATE TABLE todo (todo_id INTEGER PRIMARY KEY, todo TEXT NOT NULL, state TEXT NOT NULL);";
const insertQuery = "INSERT INTO todo VALUES (?, ?, ?)";
const deleteQuery = "DELETE FROM todo WHERE todo_id = ?";

// initialize the DB
var dbAPI = new DB(createQuery);

function insertTODO() {
  var text = document.getElementById("myInput").value;
  dbAPI.insert(insertQuery, [null, text, "Done"]);
  renderTable();
}

function deleteTODO(todoID) {
  dbAPI.delete(deleteQuery, [todoID]);
  renderTable();
}

function renderTable() {
  //execute select

  const result = dbAPI.select("SELECT * FROM todo");
  // construct table
  // base case - no data
  if (result.length === 0) {
    document.getElementById("sql-result").innerHTML = "";
    return;
  }

  // construct the header
  let headerString = "";
  let headerColumns = result[0]?.columns;
  let clmnHdrStr = headerColumns.toString();
  clmnHdrStr = clmnHdrStr.trim();
  result[0].columns.forEach((column) => {
    headerString += `<th>${column}</th>`;
  });
  headerString += `<th>Actions</th>`;
  headerString += `<th>Actions</th>`;
  headerString = `<tr>${headerString}</tr>`;

  var rows = "";
  result[0].values.forEach((row, index) => {
    console.log(row);
    var rowString = "";
    let todoId = row[0];
    row.forEach((column, index) => {
      let clmnname = headerColumns?.[index];
      console.log(clmnname, "columnname");
      if (index == "0") {
        rowString += `<td>${column}</td>`;
      } else {
        rowString += `<td><span class="spnelt" id="spn_${clmnname}_${todoId}">${column}</span><input type="text" id="inp_${clmnname}_${todoId}" class="inpelt d-none" value="${column}" /></td>`;
      }
    });

    rowString += `<td><button class="btn btn-primary"  onclick="deleteTODO(${todoId})">Delete</button></td>`;
    rowString += `<td><button  id="Edit_${todoId}" class="btn btn-primary"  onclick="EditTodo(${todoId})">Edit</button>
    <button id="Save_${todoId}" class="btn btn-primary d-none"  onclick="SaveTodo(${todoId})">Save</button>
    </td>`;
    rowString = `<tr>${rowString}</tr>`;
    rows += rowString;
  });

  let tableString = `<table>${headerString}${rows}</table>`;
  tableString += `<div class="d-none" id="headercolumnslist" data-id="${clmnHdrStr}"></div>`;
  document.getElementById("sql-result").innerHTML = tableString;
}

function EditTodo(todoId) {
  let hdrclmnlist = document
    .getElementById("headercolumnslist")
    .getAttribute("data-id");
  console.log(hdrclmnlist, "fgf");
  let ahdrclmn = hdrclmnlist.split(",");
  ahdrclmn.shift();
  console.log(`todoID ${todoId}`);
  console.log(ahdrclmn);
  ahdrclmn.forEach((value, index) => {
    let spnelt = document.getElementById(`spn_${value}_${todoId}`);
    spnelt.classList.add("d-none");
    document
      .getElementById(`inp_${value}_${todoId}`)
      .classList.remove("d-none");
  });

  document.getElementById(`Save_${todoId}`).classList.remove("d-none");
  document.getElementById(`Edit_${todoId}`).classList.add("d-none");
}

function SaveTodo(todoId) {
  let hdrclmnlist = document
    .getElementById("headercolumnslist")
    .getAttribute("data-id");
  let ahdrclmn = hdrclmnlist.split(",");
  ahdrclmn.shift();
  console.log(`todoID ${todoId}`);
  console.log(ahdrclmn);
  let setqstr = "";
  ahdrclmn.forEach((value, index) => {
    let inpval = document.getElementById(`inp_${value}_${todoId}`).value;
    let spnelt = document.getElementById(`spn_${value}_${todoId}`);
    spnelt.classList.remove("d-none");
    spnelt.innerHTML = inpval;
    document.getElementById(`inp_${value}_${todoId}`).classList.add("d-none");
    setqstr += `${value} = '${inpval}',`;
  });
  setqstr = setqstr.replace(/,\s*$/, "");
  let updateQuery = "UPDATE todo SET " + setqstr + " WHERE todo_id = ?";
  console.log(updateQuery);
  database.UpdateRow(updateQuery, todoId);
  document.getElementById(`Save_${todoId}`).classList.add("d-none");
  document.getElementById(`Edit_${todoId}`).classList.remove("d-none");
}
