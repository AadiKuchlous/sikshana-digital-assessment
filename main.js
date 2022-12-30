var question_data = [];
var headers = [];


function getS3Url(params) {
  return ("https://"+params.Bucket+".s3.ap-south-1.amazonaws.com/"+params.Key);
}


function createForm(questions) {
  console.log(questions);

  var form = document.getElementById('form');

  for (let i = 0; i < questions.length; i++) {
    let this_q = questions[i];
    let q_number = this_q["Question no."];
    let title = document.createElement("p");
    title.textContent = (i+1).toString() + ". " + this_q["Question"];
    form.appendChild(title);

    let options = ["Op. A", "Op. B", "Op. C", "Op. D"]

    for (option of options) {
      let option_title = this_q[option];
      let options_div = document.createElement("div");

      if (option_title) {
        let input = document.createElement("input");
        let label = document.createElement("label");

        let id = q_number.toString() + option;

        input.type = "radio";
        input.value = option_title;
        input.name = q_number.toString();
        input.id = id;

        label.textContent = option_title;
        label.for = id;

        options_div.appendChild(input);
        options_div.appendChild(label);
      }

      form.appendChild(options_div);
    }
  }
}


function fillQuestionData(questions) {
  for (let i = 1; i < questions.length; i++) {
    let this_q = questions[i];
    let question_obj = {};
    for (let j = 0; j < headers.length; j++) {
      question_obj[headers[j]] = this_q[j];
    }

    question_data.push(question_obj)
  }
}


function readExcelSheet(file) {
  readXlsxFile(file).then(function(rows) {
    // `rows` is an array of rows
    // each row being an array of cells.

    headers = rows[0];
    fillQuestionData(rows);
    createForm(question_data);

  })
}


async function parseS3Response(response) {
  let file = await response.blob();
  readExcelSheet(file);
}


function downloadFromSource(url, callback) {
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status); // Rejects the promise
    }
    else {
      callback(response);
    }
  });
}


// Code for getting file from AWS S3 bucket (change params when required)
// Replace with other url generator depending on storage location
// Remember to call downloadFromSource with valid URL

let params = {Bucket: "sikshana-digital-assessments", Key: "Digital Assessment - for app.xlsx"};
let url = getS3Url(params);
downloadFromSource(url, parseS3Response);
