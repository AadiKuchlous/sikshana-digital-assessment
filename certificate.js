async function generatePDF(base64_string) {
  // console.log(base64_string);

  var doc = new jspdf.jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [1000, 707],
    putOnlyUsedFonts:true,
    floatPrecision: 16 // or "smart", default is 16
  })

  doc.addImage(base64_string, 'JPEG', 0, 0, 1000, 707)
  let name = document.getElementById("name").value;
  doc.setFontSize(50)
  doc.text(260, 280, name)

  let grade = document.getElementById("grade").value;
  doc.setFontSize(40)
  doc.text(350, 355, grade)

  let school = document.getElementById("school").value + ", " + document.getElementById("crc").value;
  doc.setFontSize(20)
  doc.text(250, 425, school)

//  doc.save('cert.pdf');

  let data = doc.output("datauristring");
  console.log(data);

  if(window.matchMedia("(pointer: coarse)").matches) {
    // touchscreen
    doc.save(`certificate-${name}.pdf`);
  }
  else {

    let zoom = 100*0.65*window.innerWidth/(1000*2);

    document.getElementById("cert_modal").style.display = "block";
    document.getElementById("cert_iframe").src = data+`#zoom=${zoom}`;

    document.getElementsByClassName("modal_close")[0].onclick = function() {document.getElementById("cert_modal").style.display = "none";}
  }
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
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Certificate_1.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Certificate_2.jpeg"}),
      getS3Url({Bucket: "sikshana-digital-assessments", Key: "Certificate_3.jpeg"}),
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
