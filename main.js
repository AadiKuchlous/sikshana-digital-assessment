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


function getDriveUrl(link) {
  let id = link.split("/d/")[1].split("/view?")[0];
  return "https://drive.google.com/uc?export=view&id="+id;
}


function formSubmitted(e) {
  e.preventDefault();

//  removeElementsByClass("feedback");

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("results").style.display = "block";

  const form = new FormData(e.target);
  let questions = JSON.parse(sessionStorage.getItem("questions"));

  let answers = {}

  for (question of questions) {
    let question_number = question["Question no."];
    let category = question["Category"];
    let ans_key = question["Ans. Key"];

    let correct_ans = false;

    let response = form.get(question_number);
    if (response) {
      response = response.charAt(response.length-1);
      if (response.includes(ans_key)) {
        correct_ans = true;
      }
    }

    let ex = "";
    if (!correct_ans) {
      ex = "No answer given";
      if (response) {
        ex = question["Ex. "+response]
      }
    }

    if (!answers[category]) {
      answers[category] = [];
    }

    answers[category].push(
      {
        "question": question["Question"],
        "my_ans": response,
        "correct_ans": ans_key,
        "explanation": ex
      }
    )
  }

  let table = document.getElementById("results-table");

  // Clear Table

  table.querySelectorAll(".report").forEach(el => el.remove());

  let correct_total = 0;

  for (category in answers) {
    let cat_header_row = document.createElement("tr");
    cat_header_row.classList.add("report");
    let header_cell = document.createElement("th");
    header_cell.classList.add("category-header");
    header_cell.textContent = category;
    header_cell.colSpan = "5";
    cat_header_row.appendChild(header_cell);
    table.appendChild(cat_header_row);

    let cat_questions = answers[category];
    for (question of cat_questions) {
      let row = document.createElement("tr");

      row.classList.add("report");

      let q_cell = document.createElement("td");
      let ans_cell = document.createElement("td");
      let img_cell = document.createElement("td");
      let ans_key_cell = document.createElement("td");
      let ex_cell = document.createElement("td");

      q_cell.textContent = question.question;
      ans_cell.textContent = question.my_ans;
      ans_key_cell.textContent = question.correct_ans;
      ex_cell.textContent = question.explanation;

      if (question.my_ans == question.correct_ans) {
        img_cell.textContent = "✓";
        correct_total += 1;
      }
      else {
        img_cell.textContent = "×";
      }
      img_cell.style.fontSize = "x-large";

      q_cell.classList.add("left-align");
      ex_cell.classList.add("left-align");

      row.appendChild(q_cell);
      row.appendChild(ans_cell);
      row.appendChild(img_cell);
      row.appendChild(ans_key_cell);
      row.appendChild(ex_cell);

      table.appendChild(row);
    }
  }

  sessionStorage.setItem('score', correct_total);
}


function createForm(questions) {
  console.log(questions);

  var form = document.getElementById('form-questions');

  for (let i = 0; i < questions.length; i++) {

    let this_q = questions[i];
    let q_number = this_q["Question no."];

    let container = document.createElement("div");
    container.id = i+1;
    container.classList.add("question_contianer");
    container.style.display = "none";


    let title_area = document.createElement("div");
    title_area.classList.add("title_container");
    let title = document.createElement("p");
    title.textContent = (i+1).toString() + ". " + this_q["Question"];
    title_area.appendChild(title);

    let question_img = this_q["Image link"];
    if (question_img) {
      let image = document.createElement("img");
      image.classList.add("question_image");
      image.src = getDriveUrl(question_img);
      title_area.appendChild(image);
    }

    container.appendChild(title_area);

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
        let img;
        if (option_title.includes("drive.google.com")) {
          img = document.createElement('img')
          img.src = getDriveUrl(option_title);
        }
        else {
          option_title = option.charAt(option.length-1) + ". " + option_title;
          span.textContent = option_title;
        }

        // options_div.appendChild(input);
        label.appendChild(input);
        label.appendChild(span);
        if (img) {
          label.appendChild(img);
        }
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

    if (category == "") {
      continue;
    }

    if (!question_data[category]) {
      question_data[category] = [];
    }

    question_data[category].push(question_obj);
  }
}


function generateRandomQs(data) {
  let Qs = [];

  for (category in data) {
    console.log(category);
    let cat_questions = data[category].slice();
    let num_questions = cat_questions.length;
    let q_indices = [];

    while (q_indices.length < 3) {
      let index = Math.floor(Math.random() * num_questions);
      if (!q_indices.includes(index)) {
        console.log(index);
        if (cat_questions[index]["Ans. Key"]) {
          Qs.push(cat_questions[index]);
          q_indices.push(index);
        }
      }
    }

/*
    for (x of cat_questions) {
      Qs.push(x);
    }
*/
  }

  document.getElementById("total-question").textContent = Qs.length.toString();

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

function setQuestions(csv_data) {
  console.log("Setting Questions");

  let parsed = csv_data.csvToArray()

  console.log(parsed);

  fillQuestionData(parsed);
  console.log("Filled Question Data");
  let questions = generateRandomQs(question_data);

  console.log(questions)

  sessionStorage.setItem("questions", JSON.stringify(questions));

  createForm(questions);

}


function readCSV(file, callback) {

  file.text().then(function(data) {
    callback(data);
  })
}


async function parseS3Response(response, callback) {
  let file = await response.blob();
  readCSV(file, callback);
}


function downloadFromSource(url, callback, second_callback) {
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status); // Rejects the promise
    }
    else {
      callback(response, second_callback);
    }
  });
}


function showStartPage() {
  document.getElementById('quiz-container').style.display = "flex";
  document.getElementById('main-page').style.display = "flex";
  document.getElementById('form').style.display = "none";

  document.getElementById('results').style.display = "none";
}

function hideStartPage() {
  document.getElementById('main-page').style.display = "none";
}


function showQuestion(q_no) {
  hideStartPage();

  document.getElementById('form').style.display = "block";

  let question_divs = document.getElementById('form-questions').children;
  for (let i = 0; i < question_divs.length; i++) {
    let question_div = question_divs[i];
    let this_q_no = parseInt(question_div.id);
    if (this_q_no == q_no) {
      question_div.style.display = "block";
    }
    else {
      question_div.style.display = "none";
    }
  }

  document.getElementById("current-question").textContent = q_no.toString();
}


function start() {
  document.getElementById('form').style.display = "block";
  hideStartPage();

  sessionStorage.setItem('q_no', '0');
  nextQuestion();
}


function nextQuestion() {
  let current_q = parseInt(sessionStorage.getItem('q_no'))+1;

  sessionStorage.setItem('q_no', current_q.toString())
  showQuestion(current_q);
	
  let questions = JSON.parse(sessionStorage.getItem('questions'));
  let total_questions = questions.length;
  if (current_q == total_questions) {
    document.getElementById('next-question').style.display = "none";
    document.getElementById('submit').style.display = "block";
  }
  else {
    document.getElementById('next-question').style.display = "block";
    document.getElementById('submit').style.display = "none";
  }
}

function prevQuestion() {
  let current_q = parseInt(sessionStorage.getItem('q_no'));

  document.getElementById('next-question').style.display = "block";
  document.getElementById('submit').style.display = "none";

  if (current_q == 1) {
    showStartPage();
  }
  else {
    current_q -= 1;
    sessionStorage.setItem('q_no', current_q.toString())
    showQuestion(current_q);
  }
}


function retake() {
  showStartPage();
  document.getElementById("form").reset();
}

function noNameAlert() {
  alert("Please enter your name to start")
}


function nameChange(e) {
  let value = e.target.value;

  if (value == "") {
    document.getElementById('start').onclick = noNameAlert;
  }
  else {
    document.getElementById('start').onclick = start;
  }
}



// Code for getting file from AWS S3 bucket (change params when required)
// Replace with other url generator depending on storage location
// Remember to call downloadFromSource with valid URL

let params = {Bucket: "sikshana-digital-assessments", Key: "Digital Assessment - for app - with Kannada.csv"};
let url = getS3Url(params);
downloadFromSource(url, parseS3Response, setQuestions);

document.addEventListener("DOMContentLoaded", function(){
  start_fill_all();

  document.getElementById('start').onclick = noNameAlert;
  document.getElementById('form').onsubmit = formSubmitted;

  document.getElementById('next-question').onclick = nextQuestion;
  document.getElementById('prev-question').onclick = prevQuestion;

  document.getElementById('retake').onclick = retake;
  document.getElementById('download').onclick = downloadPDF;

  document.getElementById('name').onchange = nameChange;

  document.getElementById('brc').onchange = narrowByBRC;
  document.getElementById('crc').onchange = narrowByCRC;
  document.getElementById('school').onchange = narrowBySchool;
})
