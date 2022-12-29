function main() {
  return;
}

function readExcelSheet(file) {
  readXlsxFile(file).then(function(rows) {
    console.log(rows)
    // `rows` is an array of rows
    // each row being an array of cells.
  })
}


document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('input')
  input.addEventListener('change', function() {
    readExcelSheet(input.files[0])
  })
})
