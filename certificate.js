async function generatePDF(base64_string) {
  console.log(base64_string);

  var doc = new jspdf.jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [720, 556],
    putOnlyUsedFonts:true,
    floatPrecision: 16 // or "smart", default is 16
  })

//  doc.setFontSize(40)
//  doc.text(35, 25, 'Paranyan loves jsPDF')
  doc.addImage(base64_string, 'JPEG', 0, 0, 720, 556)

  doc.save('Certificate.pdf');
}


async function downloadPDF() {
  let url = getS3Url({Bucket: "sikshana-digital-assessments", Key: "Sample_cert_1.jpeg"})

  let img = await fetch(url);
  let blob = await img.blob();

  let base64_string;             

  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    generatePDF(reader.result);
  }
}
