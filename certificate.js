async function generatePDF(base64_string) {
  // console.log(base64_string);

  var doc = new jspdf.jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [720, 556],
    putOnlyUsedFonts:true,
    floatPrecision: 16 // or "smart", default is 16
  })

  doc.addImage(base64_string, 'JPEG', 0, 0, 720, 556)

  let name = document.getElementById("name").value;
  doc.setFontSize(40)
  doc.text(230, 210, name)

  let grade = document.getElementById("grade").value;
  doc.setFontSize(30)
  doc.text(300, 270, grade)

  let school = "GOVT- URDU BOYS LOWER PRIMARY SCHOOL GADDANAKERI";
  doc.setFontSize(13)
  doc.text(360, 270, school)

  let village = "BAGALKOT";
  doc.setFontSize(20)
  doc.text(240, 320, village)

  let date = new Date().toLocaleDateString().padStart(10, '0');
  doc.setFontSize(20)
  doc.setTextColor(0.6)
  doc.text(300, 430, date)

//  doc.save('cert.pdf');

  let data = doc.output("datauristring");
  console.log(data);

  document.getElementById("cert_modal").style.display = "block";
  document.getElementById("cert_iframe").src = data+"#zoom=50";

  document.getElementsByClassName("modal_close")[0].onclick = function() {document.getElementById("cert_modal").style.display = "none";}
}


async function downloadPDF() {
/*
  let urls = 
    [
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_1.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_2.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_3.jpeg"}),
    ];
*/
  let urls = 
    [
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "certificate_test.jpg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "certificate_test.jpg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "certificate_test.jpg"}),
    ];

  score = parseInt(sessionStorage.getItem('score'));

  let url_index = 0;
  if (score > 0) {
    url_index = Math.floor((score - 1) / 4);
  }

  let url = urls[url_index]
  console.log(url);

  let img = await fetch(url);
  let blob = await img.blob();

  let base64_string;

  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    generatePDF(reader.result);
  }

}
