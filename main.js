var question_data = {};
var headers = [];


function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}


function getS3Url(params) {
  return ("https://"+params.Bucket+".s3.ap-south-1.amazonaws.com/"+params.Key);
}


function formSubmitted(e) {
  e.preventDefault();

  removeElementsByClass("feedback");

  const form = new FormData(e.target);
  let questions = JSON.parse(sessionStorage.getItem("questions"));
  for (question of questions) {
    let question_number = question["Question no."];

    let ans_key = question["Ans. Key"]

    let correct_ans = false;

    let response = form.get(question_number);
    if (response) {
      response = response.charAt(response.length-1);
      if (response.includes(ans_key)) {
        correct_ans = true;
      }
    }

    let feedback_div = document.createElement("div");
    feedback_div.classList.add("feedback");

    if (correct_ans) {
      feedback_div.textContent = "Answer is Correct";
    }
    else {
      let ex = "No answer given";
      if (response) {
        ex = question["Ex. "+response]
      }
      feedback_div.textContent = "Answer is Incorrect. " + ex;
    }

    let question_div = document.getElementById(question_number)
    question_div.appendChild(feedback_div);

  }
}


function createForm(questions) {
  console.log(questions);

  var form = document.getElementById('form-questions');

  for (let i = 0; i < questions.length; i++) {

    let this_q = questions[i];
    let q_number = this_q["Question no."];

    let container = document.createElement("div");
    container.id = q_number;

    let title = document.createElement("p");
    title.textContent = (i+1).toString() + ". " + this_q["Question"];
    container.appendChild(title);

    let options = ["Op. A", "Op. B", "Op. C", "Op. D"]

    for (option of options) {
      let option_title = this_q[option];
      let options_div = document.createElement("div");

      if (option_title) {
        let input = document.createElement("input");
        let label = document.createElement("label");

        let id = q_number.toString() + option;

        input.type = "radio";
        input.value = option;
        input.name = q_number.toString();
        input.id = id;

        // label.textContent = option_title;
        label.for = id;

        let span = document.createElement("span");
        span.textContent = option_title;

        // options_div.appendChild(input);
        label.appendChild(input);
        label.appendChild(span);
        options_div.appendChild(label);
      }

      container.appendChild(options_div);

      form.appendChild(container);
    }
  }
}


function fillQuestionData(questions) {
  let all_headers = questions[0]
  for (header of all_headers) {
    headers.push(header.trim());
  }

  for (let i = 1; i < questions.length; i++) {
    let this_q = questions[i];
    let question_obj = {};
    for (let j = 0; j < headers.length; j++) {
      question_obj[headers[j]] = this_q[j];
    }

    let category = question_obj.Category.trim();

    if (!question_data[category]) {
      question_data[category] = [];
    }

    question_data[category].push(question_obj);
  }
}


function generateRandomQs(data) {
  let Qs = [];
  for (category in data) {
    let cat_questions = data[category].slice();
    let num_questions = cat_questions.length;
    let q_indices = [];

    while (q_indices.length < 3) {
      let index = Math.floor(Math.random() * num_questions);
      if (!q_indices.includes(index)) {
        Qs.push(cat_questions[index]);
        q_indices.push(index);
      }
    }

/*
    for (x of cat_questions) {
      Qs.push(x);
    }
*/
  }

  return(Qs)
}


function readExcelSheet(file) {
  readXlsxFile(file).then(function(rows) {
    // `rows` is an array of rows
    // each row being an array of cells.

    // headers = rows[0];
    fillQuestionData(rows);
    let questions = generateRandomQs(question_data);

    sessionStorage.setItem("questions", JSON.stringify(questions));

    createForm(questions);
  })
}


function readCSV(file) {

  file.text().then(function(data) {
    let parsed = data.csvToArray()

    fillQuestionData(parsed);
    let questions = generateRandomQs(question_data);

    sessionStorage.setItem("questions", JSON.stringify(questions));

    createForm(questions);
  })
}


async function parseS3Response(response) {
  let file = await response.blob();
  // readExcelSheet(file);
  readCSV(file);
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

let params = {Bucket: "sikshana-digital-assessments", Key: "Digital Assessment - for app.csv"};
let url = getS3Url(params);
downloadFromSource(url, parseS3Response);

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('form').onsubmit = formSubmitted;
})
