function insertTODO() {
  todo.insertTODO();
}

function deleteTODO(todoID) {
  todo.deleteTODO(todoID);
}

// TODO this is more involved.. e.g. how to update a specific row?
function updateTODO() {
  var text = document.getElementById("myInput").value;
  db.run("UPDATE todo SET state = 'Done' WHERE todo = ?", [text]);

  // Boilerplate: render the table
  todo.renderTable();
}
