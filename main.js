var question_data = [];
var headers = [];


function createForm(questions) {
  console.log(questions);

  var form = document.getElementById('form');

  for (let i = 0; i < questions.length; i++) {
    let this_q = questions[i];
    let q_number = this_q["Question no."];
    let title = document.createElement("p");
    title.textContent = this_q["Question"];
    form.appendChild(title);

    let options = ["Op. A", "Op. B", "Op. C", "Op. D"]

    for (option of options) {
      let option_title = this_q[option];
      let options_div = document.createElement("div");

      if (option_title) {
        let input = document.createElement("input");
        let label = document.createElement("label");

        let id = q_number.toString + option;

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


// Code for getting file from AWS S3 bucket (change credentials and params where required)
// Replace with other API dependent of file location
// Remember to call downloadFromSource with valid URL
AWS.config.update({
  accessKeyId: "AKIA5TOZ3QKAM6IW3BMK",
  secretAccessKey: "aZNygdSDcsKeeHHDQkF3vTuez7IHb0/weD/TbvVW",
  "region": "ap-south-1"
});

let s3 = new AWS.S3();

let params = {Bucket: "sikshana-digital-assessments", Key: "Digital Assessment - for app.xlsx"};
s3.getSignedUrl('getObject', params, function(err, url){
  downloadFromSource(url, parseS3Response);
});
// End AWS code


/*
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('input')
  input.addEventListener('change', function() {
    readExcelSheet(input.files[0])
  })
})
*/
