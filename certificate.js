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
  doc.setFontSize(70)
  doc.text(270, 250, name)

  let date = new Date().toLocaleDateString().padStart(10, '0');
  doc.setFontSize(20)
  doc.setTextColor(0.6)
  doc.text(360, 336, date)

//  doc.save('cert.pdf');

  let data = doc.output("datauristring");
  console.log(data);

  document.getElementById("cert_modal").style.display = "block";
  document.getElementById("cert_iframe").src = data+"#zoom=50";

  document.getElementsByClassName("modal_close")[0].onclick = function() {document.getElementById("cert_modal").style.display = "none";}
}


async function downloadPDF() {
  let urls = 
    [
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_1.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_2.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_3.jpeg"}),
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
