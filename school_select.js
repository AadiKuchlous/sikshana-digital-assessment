let all_schools = {}

function narrowByBRC() {
  let brc_dropdown = document.getElementById("brc");
  let crc_dropdown = document.getElementById("crc");
  let school_dropdown = document.getElementById("school");

  let brc_name = brc_dropdown.value;

  crc_dropdown.innerHTML = "";
  school_dropdown.innerHTML = "";

  console.log();

  for (crc in all_schools[brc_name]) {
    let option = document.createElement("option");
    option.value = crc;
    option.innerHTML = crc;
    crc_dropdown.appendChild(option);

    for (school of all_schools[brc_name][crc]) {
      let option = document.createElement("option");
      option.value = school;
      option.innerHTML = school;
      school_dropdown.appendChild(option);
    }
  }
  narrowByCRC();
}


function narrowByCRC() {
  let brc_dropdown = document.getElementById("brc");
  let crc_dropdown = document.getElementById("crc");
  let school_dropdown = document.getElementById("school");

  let brc_name = brc_dropdown.value;
  let crc_name = crc_dropdown.value;

  school_dropdown.innerHTML = "";

  for (school of all_schools[brc_name][crc_name]) {
    let option = document.createElement("option");
    option.value = school;
    option.innerHTML = school;
    school_dropdown.appendChild(option);
  }
}


function narrowBySchool() {
  return;
}


function setSchoolData(csv_data) {
  let parsed = csv_data.csvToArray()

  let brc_dropdown = document.getElementById("brc");
  let crc_dropdown = document.getElementById("crc");
  let school_dropdown = document.getElementById("school");

  brc_dropdown.innerHTML = "";
  crc_dropdown.innerHTML = "";
  school_dropdown.innerHTML = "";

  for (let i=1; i<parsed.length; i++) {
    let school_data = parsed[i];

    let brc = school_data[5]
    let crc = school_data[7]
    let school = school_data[9]

    if (all_schools[brc]) {
      if (all_schools[brc][crc]) {
        if (all_schools[brc][crc].includes(school)) {
          continue
        }
        else {
          all_schools[brc][crc].push(school);
/*
          let option = document.createElement("option");
          option.value = school;
          option.innerHTML = school;
          school_dropdown.appendChild(option);
*/
        }
      }
      else {
        all_schools[brc][crc] = [school];
/*      
        let option = document.createElement("option");
        option.value = crc;
        option.innerHTML = crc;
        crc_dropdown.appendChild(option);
*/
      }
    }
    else {
      all_schools[brc] = {};
      all_schools[brc][crc] = [school];

      let option = document.createElement("option");
      option.value = brc;
      option.innerHTML = brc;
      brc_dropdown.appendChild(option);
    }
  }

  console.log(all_schools);
  narrowByBRC();
}

function start_fill_all() {
  let params = {Bucket: "sikshana-digital-assessments", Key: "school_list.csv"};
  let url = getS3Url(params);
  console.log(params, url)
  downloadFromSource(url, parseS3Response, setSchoolData);

  return;
}
